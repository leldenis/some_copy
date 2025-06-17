import { SelectionModel } from '@angular/cdk/collections';
import { CdkVirtualScrollViewport, ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  forwardRef,
  ChangeDetectionStrategy,
  ViewChild,
  OnInit,
  OnDestroy,
  AfterViewInit,
  inject,
} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  FormControl,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatAutocomplete, MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatChipsModule } from '@angular/material/chips';
import { MatOptionSelectionChange } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { DriverStatus } from '@constant';
import { Driver, PaginationCollectionDto } from '@data-access';
import { TranslateModule } from '@ngx-translate/core';
import { DriverService } from '@ui/core';
import { ProgressSpinnerComponent } from '@ui/shared';
import { SearchHighlightPipe } from '@ui/shared/pipes/search-highlight/search-highlight.pipe';
import { ICONS } from '@ui/shared/tokens';
import { NgxTippyModule } from 'ngx-tippy-wrapper';
import {
  BehaviorSubject,
  catchError,
  debounceTime,
  distinctUntilChanged,
  finalize,
  map,
  Observable,
  of,
  startWith,
  Subject,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs';

@Component({
  selector: 'upf-drivers-selection-autocomplete',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatIconModule,
    MatInputModule,
    TranslateModule,
    ScrollingModule,
    NgxTippyModule,
    ProgressSpinnerComponent,
    SearchHighlightPipe,
  ],
  templateUrl: './drivers-selection-autocomplete.component.html',
  styleUrls: ['./drivers-selection-autocomplete.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DriversSelectionAutocompleteComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => DriversSelectionAutocompleteComponent),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DriversSelectionAutocompleteComponent implements ControlValueAccessor, OnInit, OnDestroy, AfterViewInit {
  @ViewChild(CdkVirtualScrollViewport, { static: true })
  public scroller: CdkVirtualScrollViewport;

  @ViewChild(MatAutocomplete)
  public autocomplete: MatAutocomplete;

  @Input() public fleetId: string;
  @Input() public currentDriver: Driver;
  @Input() public disabled: boolean;
  @Input() public inputClass: string;

  public readonly itemHeightPx = 42;
  public readonly itemsPerPage = 5;
  public readonly panelHeightPx = this.itemHeightPx * this.itemsPerPage;

  public filterControl = new FormControl<string>('');
  public isLoading = false;
  public hasNext = false;
  public selection: SelectionModel<Driver> = new SelectionModel(true, []);
  public drivers$: BehaviorSubject<Driver[]> = new BehaviorSubject([]);
  public filteredDrivers$: Observable<Driver[]> = this.drivers$.pipe(map((drivers) => this.filterDrivers(drivers)));
  public panelHeight$: Observable<number> = this.filteredDrivers$.pipe(
    map(({ length }) => Math.min(length * this.itemHeightPx, this.panelHeightPx)),
  );

  private offset = 0;
  private readonly limit = 30;
  private readonly destroyed$ = new Subject<void>();

  public readonly icons = inject(ICONS);
  public readonly driverService = inject(DriverService);

  public ngAfterViewInit(): void {
    if (this.disabled) {
      this.filterControl.disable();
    }
  }

  public ngOnInit(): void {
    this.handleFilterChange();
  }

  public ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  public handleScroll(index: number): void {
    if (index && index + this.itemsPerPage >= this.scroller.getDataLength() && !this.isLoading && this.hasNext) {
      this.getDrivers(this.filterControl.value, false).subscribe();
    }
  }

  public getDrivers(name: string = '', triggeredBySearch = true): Observable<PaginationCollectionDto<Driver>> {
    this.isLoading = true;
    this.offset = triggeredBySearch ? 0 : this.offset + this.limit;

    return this.driverService
      .getFleetDrivers(
        this.fleetId,
        {
          name,
          phone: '',
          status: DriverStatus.ALL,
        },
        this.limit,
        this.offset,
      )
      .pipe(
        catchError(() => of({ items: [], total_count: 0 })),
        tap((paginatedDrivers) => this.setDrivers(paginatedDrivers, triggeredBySearch)),
        finalize(() => {
          this.isLoading = false;
        }),
      );
  }

  public handleDriverSelection(driver: Driver, event: MatOptionSelectionChange): void {
    if (!event.isUserInput) {
      return;
    }

    this.selection.select(driver);
    this.onChange(this.selection.selected);
    this.drivers$.next(this.drivers$.value);
  }

  public handleDriverRemoval(driver: Driver): void {
    this.selection.deselect(driver);
    this.onChange(this.selection.selected);
    this.drivers$.next(this.drivers$.value);
  }

  public onChange = (_: Driver[]): void => {};
  public onTouched = (): void => {};

  public validate({ value }: AbstractControl): null | Record<string, boolean> {
    return value.length > 0 ? null : { noDriversSelected: true };
  }

  public writeValue(drivers: Driver[]): void {
    if (drivers.length === 0) {
      return;
    }

    this.selection.select(...drivers);
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

  public markAsTouched(): void {
    this.filterControl.markAsTouched();
    this.filterControl.updateValueAndValidity();
  }

  private handleFilterChange(): void {
    this.filterControl.valueChanges
      .pipe(
        startWith(''),
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((name) => this.getDrivers(name)),
        takeUntil(this.destroyed$),
      )
      .subscribe();
  }

  private filterDrivers(drivers: Driver[]): Driver[] {
    const selectedIds = new Set(this.selection.selected.map(({ id }) => id));
    return drivers.filter(({ id }) => !selectedIds.has(id));
  }

  private setDrivers({ items, total_count }: PaginationCollectionDto<Driver>, triggeredBySearch: boolean): void {
    this.hasNext = this.drivers$.value.length + items.length < total_count;
    this.drivers$.next(triggeredBySearch ? items : [...this.drivers$.value, ...items]);
    this.autocomplete.options.forEach((option) => option.deselect());
  }
}
