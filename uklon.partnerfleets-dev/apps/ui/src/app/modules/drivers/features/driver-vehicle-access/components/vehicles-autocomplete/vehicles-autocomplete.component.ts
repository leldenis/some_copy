import { SelectionModel } from '@angular/cdk/collections';
import { CdkVirtualScrollViewport, ScrollingModule } from '@angular/cdk/scrolling';
import { AsyncPipe, NgClass } from '@angular/common';
import {
  Component,
  Input,
  forwardRef,
  ViewChild,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
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
import { MatAutocomplete, MatAutocompleteTrigger, MatOption } from '@angular/material/autocomplete';
import { MatChip, MatChipListbox, MatChipRemove } from '@angular/material/chips';
import { MatOptionSelectionChange } from '@angular/material/core';
import { MatFormField, MatHint, MatLabel, MatSuffix } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { FleetVehicleDto, FleetVehicleCollectionDto } from '@data-access';
import { TranslateModule } from '@ngx-translate/core';
import { VehiclesService } from '@ui/modules/vehicles/services/vehicles.service';
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
  selector: 'upf-vehicles-autocomplete',
  standalone: true,
  imports: [
    MatFormField,
    NgClass,
    TranslateModule,
    MatInput,
    MatAutocompleteTrigger,
    ReactiveFormsModule,
    MatIcon,
    MatAutocomplete,
    ScrollingModule,
    AsyncPipe,
    MatOption,
    SearchHighlightPipe,
    ProgressSpinnerComponent,
    MatChipListbox,
    MatChip,
    NgxTippyModule,
    MatLabel,
    MatHint,
    MatChipRemove,
    MatSuffix,
  ],
  templateUrl: './vehicles-autocomplete.component.html',
  styleUrls: ['./vehicles-autocomplete.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => VehiclesAutocompleteComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => VehiclesAutocompleteComponent),
      multi: true,
    },
  ],
})
export class VehiclesAutocompleteComponent implements ControlValueAccessor, OnInit, OnDestroy, AfterViewInit {
  @ViewChild(CdkVirtualScrollViewport, { static: true })
  public scroller: CdkVirtualScrollViewport;

  @ViewChild(MatAutocomplete)
  public autocomplete: MatAutocomplete;

  @Input() public fleetId: string;
  @Input() public currentVehicle: FleetVehicleDto;
  @Input() public disabled: boolean;
  @Input() public inputClass: string;

  public readonly itemHeightPx = 42;
  public readonly itemsPerPage = 5;
  public readonly panelHeightPx = this.itemHeightPx * this.itemsPerPage;

  public filterControl = new FormControl<string>('');
  public isLoading = false;
  public hasNext = false;
  public selection = new SelectionModel<FleetVehicleDto>(true, []);

  public readonly icons = inject(ICONS);
  public readonly vehicleService = inject(VehiclesService);

  public vehicles$ = new BehaviorSubject<FleetVehicleDto[]>([]);
  public filteredVehicles$: Observable<FleetVehicleDto[]> = this.vehicles$.pipe(
    map((drivers) => this.filterVehicles(drivers)),
  );
  public panelHeight$: Observable<number> = this.filteredVehicles$.pipe(
    map(({ length }) => Math.min(length * this.itemHeightPx, this.panelHeightPx)),
  );

  private readonly limit = 30;
  private offset = 0;
  private readonly destroyed$ = new Subject<void>();

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
      this.getVehicles(false, this.filterControl.value).subscribe();
    }
  }

  public getVehicles(triggeredBySearch: boolean, licencePlate: string = ''): Observable<FleetVehicleCollectionDto> {
    this.isLoading = true;
    this.offset = triggeredBySearch ? 0 : this.offset + this.limit;

    return this.vehicleService
      .getFleetVehicles(this.fleetId, {
        licencePlate,
        limit: this.limit,
        offset: this.offset,
      })
      .pipe(
        catchError(() => of({ data: [], total: 0 })),
        tap((vehicles) => this.setVehicles(vehicles, triggeredBySearch)),
        finalize(() => {
          this.isLoading = false;
        }),
      );
  }

  public handleVehicleSelection(vehicle: FleetVehicleDto, event: MatOptionSelectionChange): void {
    if (!event.isUserInput) return;

    this.selection.select(vehicle);
    this.onChange(this.selection.selected);
    this.vehicles$.next(this.vehicles$.value);
  }

  public handleVehicleRemoval(vehicle: FleetVehicleDto): void {
    this.selection.deselect(vehicle);
    this.onChange(this.selection.selected);
    this.vehicles$.next(this.vehicles$.value);
  }

  public onChange = (_: FleetVehicleDto[]): void => {};
  public onTouched = (): void => {};

  public validate({ value }: AbstractControl): null | Record<string, boolean> {
    return value.length > 0 ? null : { noVehiclesSelected: true };
  }

  public writeValue(vehicles: FleetVehicleDto[]): void {
    if (vehicles.length === 0) return;

    this.selection.select(...vehicles);
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
        switchMap((value) => this.getVehicles(true, value)),
        takeUntil(this.destroyed$),
      )
      .subscribe();
  }

  private filterVehicles(vehicles: FleetVehicleDto[]): FleetVehicleDto[] {
    const selectedIds = new Set(this.selection.selected.map(({ id }) => id));
    return vehicles.filter(({ id }) => !selectedIds.has(id));
  }

  private setVehicles({ data, total }: FleetVehicleCollectionDto, triggeredBySearch: boolean): void {
    this.hasNext = this.vehicles$.value.length + data.length < total;
    this.vehicles$.next(triggeredBySearch ? data : [...this.vehicles$.value, ...data]);
    this.autocomplete.options.forEach((option) => option.deselect());
  }
}
