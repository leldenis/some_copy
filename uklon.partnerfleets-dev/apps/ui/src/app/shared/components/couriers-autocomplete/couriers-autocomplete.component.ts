import { CdkVirtualScrollViewport, ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  Input,
  OnInit,
  ViewChild,
  forwardRef,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatOptionSelectionChange } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { CollectionCursorDto, CourierItemDto } from '@data-access';
import { TranslateModule } from '@ngx-translate/core';
import { CouriersService } from '@ui/modules/couriers/services/couriers.service';
import { ProgressSpinnerComponent } from '@ui/shared/components';
import { LetDirective } from '@ui/shared/directives/let.directive';
import { SearchHighlightPipe } from '@ui/shared/pipes/search-highlight/search-highlight.pipe';
import { ICONS } from '@ui/shared/tokens';
import { TO_FILTER_FORMAT } from '@ui/shared/utils';
import {
  BehaviorSubject,
  Observable,
  catchError,
  debounceTime,
  finalize,
  map,
  of,
  startWith,
  switchMap,
  tap,
} from 'rxjs';

const DEBOUNCE_TIME_MS = 300;
const API_SEARCH_CHARS_NUM = 4;
const EMPTY_RESPONSE: CollectionCursorDto<CourierItemDto> = { items: [], next_cursor: '0' };

@Component({
  selector: 'upf-couriers-autocomplete',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatIconModule,
    ReactiveFormsModule,
    TranslateModule,
    ScrollingModule,
    LetDirective,
    ProgressSpinnerComponent,
    SearchHighlightPipe,
  ],
  templateUrl: './couriers-autocomplete.component.html',
  styleUrls: ['./couriers-autocomplete.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CouriersAutocompleteComponent),
      multi: true,
    },
  ],
})
export class CouriersAutocompleteComponent implements OnInit, ControlValueAccessor {
  @ViewChild(CdkVirtualScrollViewport, { static: true })
  public scroller: CdkVirtualScrollViewport;

  @ViewChild(MatAutocomplete)
  public autocomplete: MatAutocomplete;

  @Input({ required: true }) public fleetId: string;

  @Input() public withAllDriversOption = true;

  public readonly itemHeightPx = 42;
  public readonly itemsPerPage = 5;
  public readonly panelHeightPx = this.itemHeightPx * this.itemsPerPage;
  public readonly couriers$: BehaviorSubject<CourierItemDto[]> = new BehaviorSubject([]);
  public readonly filterControl = new FormControl(null);
  public readonly filteredCouriers$: Observable<CourierItemDto[]> = this.couriers$.pipe(
    map((couriers) => this.filterCouriers(couriers)),
  );
  public readonly panelHeight$: Observable<number> = this.filteredCouriers$.pipe(
    map(({ length }) => {
      const itemsNum = Math.max(length, 1);
      return Math.min(itemsNum * this.itemHeightPx, this.panelHeightPx);
    }),
  );

  public hasNext = false;
  public isLoading = false;
  public selectedCourierId: string;
  public inputFocused: boolean;

  private cursor = '0';
  private readonly limit = 30;

  private readonly destroyRef = inject(DestroyRef);
  public readonly icons = inject(ICONS);
  public readonly couriersService = inject(CouriersService);

  public ngOnInit(): void {
    this.handleFilterChange();
  }

  public onChange = (_: string): void => {};
  public onTouched = (): void => {};
  public displayWithFn(couriers: CourierItemDto): string {
    if (!couriers) return '';
    return `${couriers.last_name} ${couriers.first_name}`;
  }

  public handleScroll(index: number): void {
    if (index && index + this.itemsPerPage >= this.scroller.getDataLength() && !this.isLoading && this.hasNext) {
      this.getCouriers(false, this.filterControl.value).subscribe();
    }
  }

  public getCouriers(
    triggeredBySearch: boolean,
    filterValue: string | CourierItemDto = '',
  ): Observable<CollectionCursorDto<CourierItemDto>> {
    if (this.isCourier(filterValue) || (filterValue !== '' && filterValue?.length < API_SEARCH_CHARS_NUM)) {
      this.setCouriers(EMPTY_RESPONSE, true);
      return of(EMPTY_RESPONSE);
    }

    this.isLoading = true;
    this.cursor = triggeredBySearch ? '0' : this.cursor;

    return this.couriersService
      .getFleetCouriers(this.fleetId, { name: filterValue, phone: '', limit: this.limit, cursor: this.cursor })
      .pipe(
        catchError(() => of(EMPTY_RESPONSE)),
        tap(({ items, next_cursor }) => this.setCouriers({ items, next_cursor }, triggeredBySearch)),
        finalize(() => {
          this.isLoading = false;
        }),
      );
  }

  public onSelectionChange({ isUserInput, source: { value } }: MatOptionSelectionChange<CourierItemDto>): void {
    if (!isUserInput) return;

    this.selectedCourierId = value.id;
    this.onChange(value.id);
  }

  public resetControl(): void {
    this.filterControl.reset('');
    this.selectedCourierId = '';
    this.onChange(this.selectedCourierId);
  }

  public writeValue(id: string): void {
    if (!id) {
      this.resetControl();
      return;
    }

    this.couriersService.getFleetCourierById(this.fleetId, id).subscribe((courier) => {
      this.filterControl.setValue(courier);
      this.selectedCourierId = id;
    });
  }

  public registerOnChange(fn: () => void): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  public setDisabledState?(isDisabled: boolean): void {
    isDisabled ? this.filterControl.disable() : this.filterControl.enable();
  }

  public handleChange(event: KeyboardEvent): void {
    if (!this.selectedCourierId) return;

    const name: string = (event.target as HTMLInputElement).value;
    const names = this.couriers$.value.map(({ first_name, last_name }) => `${last_name} ${first_name}`);

    if (!names.includes(name)) {
      this.selectedCourierId = '';
      this.onChange('');
    }
  }

  private handleFilterChange(): void {
    this.filterControl.valueChanges
      .pipe(
        startWith(''),
        debounceTime(DEBOUNCE_TIME_MS),
        switchMap((name: string) => this.getCouriers(true, name)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }

  private filterCouriers(couriers: CourierItemDto[]): CourierItemDto[] {
    return couriers.filter(({ id }) => this.selectedCourierId !== id);
  }

  private setCouriers({ items, next_cursor }: CollectionCursorDto<CourierItemDto>, triggeredBySearch: boolean): void {
    this.hasNext = !!Number(next_cursor);
    this.cursor = `${next_cursor}`;

    const couriers = triggeredBySearch ? items : [...this.couriers$.value, ...items];
    couriers.sort((a, b) =>
      TO_FILTER_FORMAT(a.last_name + a.first_name).localeCompare(TO_FILTER_FORMAT(b.last_name + b.first_name)),
    );

    this.couriers$.next(couriers);
    this.autocomplete.options.forEach((option) => option.deselect());
  }

  private isCourier(value: string | CourierItemDto): value is CourierItemDto {
    return typeof value !== 'string';
  }
}
