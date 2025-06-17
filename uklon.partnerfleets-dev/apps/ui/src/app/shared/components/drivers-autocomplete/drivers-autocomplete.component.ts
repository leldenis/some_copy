import { CdkVirtualScrollViewport, ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
  forwardRef,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatOptionSelectionChange } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { DriverStatus } from '@constant';
import { Driver, FleetDriversCollection, PaginationCollectionDto } from '@data-access';
import { TranslateModule } from '@ngx-translate/core';
import { DriverService } from '@ui/core';
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
const EMPTY_RESPONSE: FleetDriversCollection = { items: [], total_count: 0 };

@Component({
  selector: 'upf-drivers-autocomplete',
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
  templateUrl: './drivers-autocomplete.component.html',
  styleUrls: ['./drivers-autocomplete.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DriversAutocompleteComponent),
      multi: true,
    },
  ],
})
export class DriversAutocompleteComponent implements OnInit {
  @ViewChild(CdkVirtualScrollViewport, { static: true })
  public scroller: CdkVirtualScrollViewport;

  @ViewChild(MatAutocomplete)
  public autocomplete: MatAutocomplete;

  @Input({ required: true }) public fleetId: string;
  @Input() public withAllDriversOption = true;

  @Output() public driverChange = new EventEmitter<Driver>();

  public readonly itemHeightPx = 42;
  public readonly itemsPerPage = 5;
  public readonly panelHeightPx = this.itemHeightPx * this.itemsPerPage;
  public readonly drivers$: BehaviorSubject<Driver[]> = new BehaviorSubject([]);
  public readonly filterControl = new FormControl(null);
  public readonly filteredDrivers$: Observable<Driver[]> = this.drivers$.pipe(
    map((couriers) => this.filterDrivers(couriers)),
  );
  public readonly panelHeight$: Observable<number> = this.filteredDrivers$.pipe(
    map(({ length }) => {
      const itemsNum = Math.max(length, 1);
      return Math.min(itemsNum * this.itemHeightPx, this.panelHeightPx);
    }),
  );

  public hasNext = false;
  public isLoading = false;
  public selectedDriverId: string;
  public inputFocused: boolean;

  private offset = 0;
  private readonly limit = 30;
  private readonly destroyRef = inject(DestroyRef);
  public readonly icons = inject(ICONS);

  constructor(
    private readonly driversService: DriverService,
    private readonly host: ElementRef,
  ) {
    this.host.nativeElement.dataset.cy = 'drivers-control';
  }

  public ngOnInit(): void {
    this.handleFilterChange();
  }

  public onChange = (_: string): void => {};
  public onTouched = (): void => {};

  public displayWithFn(driver: Driver): string {
    if (!driver) return '';
    return `${driver.last_name} ${driver.first_name}`;
  }

  public handleScroll(index: number): void {
    if (index && index + this.itemsPerPage >= this.scroller.getDataLength() && !this.isLoading && this.hasNext) {
      this.getDrivers(false, this.filterControl.value).subscribe();
    }
  }

  public getDrivers(
    triggeredBySearch: boolean,
    filterValue: string | Driver = '',
  ): Observable<PaginationCollectionDto<Driver>> {
    if (this.isDriver(filterValue) || (filterValue !== '' && filterValue?.length < API_SEARCH_CHARS_NUM)) {
      this.setDrivers(EMPTY_RESPONSE, true);
      return of(EMPTY_RESPONSE);
    }

    this.isLoading = true;
    this.offset = triggeredBySearch ? 0 : this.offset + this.limit;

    return this.driversService
      .getFleetDrivers(
        this.fleetId,
        { name: filterValue, phone: '', status: DriverStatus.ALL },
        this.limit,
        this.offset,
      )
      .pipe(
        catchError(() => of(EMPTY_RESPONSE)),
        tap((paginatedDrivers) => this.setDrivers(paginatedDrivers, triggeredBySearch)),
        finalize(() => {
          this.isLoading = false;
        }),
      );
  }

  public onSelectionChange({ isUserInput, source: { value } }: MatOptionSelectionChange<Driver>): void {
    if (!isUserInput) return;

    this.selectedDriverId = value.id;
    this.onChange(value.id);
    this.driverChange.emit(value);
  }

  public resetControl(): void {
    this.filterControl.reset('');
    this.selectedDriverId = '';
    this.onChange(this.selectedDriverId);
  }

  public writeValue(id: string): void {
    if (!id) {
      this.resetControl();
      return;
    }

    this.driversService.getFleetDriverById(this.fleetId, id).subscribe((driver) => {
      this.filterControl.setValue(driver);
      this.selectedDriverId = id;
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
    if (!this.selectedDriverId) return;

    const name: string = (event.target as HTMLInputElement).value;
    const names = this.drivers$.value.map(({ first_name, last_name }) => `${last_name} ${first_name}`);

    if (!names.includes(name)) {
      this.selectedDriverId = '';
      this.onChange('');
    }
  }

  private handleFilterChange(): void {
    this.filterControl.valueChanges
      .pipe(
        startWith(''),
        debounceTime(DEBOUNCE_TIME_MS),
        switchMap((name: string | Driver) => this.getDrivers(true, name)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }

  private filterDrivers(drivers: Driver[]): Driver[] {
    return drivers.filter(({ id }) => this.selectedDriverId !== id);
  }

  private setDrivers({ items, total_count }: PaginationCollectionDto<Driver>, triggeredBySearch: boolean): void {
    this.hasNext = this.drivers$.value.length + items.length < total_count;

    const drivers = triggeredBySearch ? items : [...this.drivers$.value, ...items];
    drivers.sort((a, b) =>
      TO_FILTER_FORMAT(a.last_name + a.first_name).localeCompare(TO_FILTER_FORMAT(b.last_name + b.first_name)),
    );

    this.drivers$.next(drivers);
    this.autocomplete.options.forEach((option) => option.deselect());
  }

  private isDriver(value: string | Driver): value is Driver {
    return typeof value !== 'string';
  }
}
