import { CdkFixedSizeVirtualScroll, CdkVirtualForOf, CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  EventEmitter,
  forwardRef,
  inject,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ControlValueAccessor, FormControl, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatChipsModule } from '@angular/material/chips';
import { MatOptionSelectionChange, MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { FleetVehicleDto, FleetVehicleCollectionDto } from '@data-access';
import { TranslateModule } from '@ngx-translate/core';
import { VehiclesService } from '@ui/modules/vehicles/services/vehicles.service';
import { ProgressSpinnerComponent } from '@ui/shared';
import { LetDirective } from '@ui/shared/directives/let.directive';
import { SearchHighlightPipe } from '@ui/shared/pipes/search-highlight/search-highlight.pipe';
import { ICONS } from '@ui/shared/tokens';
import { BehaviorSubject, catchError, debounceTime, finalize, map, Observable, of, tap } from 'rxjs';
import { startWith, switchMap } from 'rxjs/operators';

const DEBOUNCE_TIME_MS = 300;
const EMPTY_RESPONSE: FleetVehicleCollectionDto = { data: [], total: 0 };

@Component({
  selector: 'upf-vehicle-autocomplete',
  standalone: true,
  imports: [
    CommonModule,
    CdkFixedSizeVirtualScroll,
    CdkVirtualForOf,
    CdkVirtualScrollViewport,
    FormsModule,
    MatIconModule,
    MatAutocompleteModule,
    MatChipsModule,
    MatFormFieldModule,
    MatInputModule,
    MatOptionModule,
    TranslateModule,
    ReactiveFormsModule,
    LetDirective,
    ProgressSpinnerComponent,
    SearchHighlightPipe,
  ],
  templateUrl: './vehicle-autocomplete.component.html',
  styleUrls: ['./vehicle-autocomplete.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => VehicleAutocompleteComponent),
      multi: true,
    },
    VehiclesService,
  ],
})
export class VehicleAutocompleteComponent implements ControlValueAccessor, OnInit {
  @ViewChild(CdkVirtualScrollViewport, { static: true })
  public scroller: CdkVirtualScrollViewport;

  @ViewChild(MatAutocomplete)
  public autocomplete: MatAutocomplete;

  @Input({ required: true }) public fleetId: string;

  @Output() public vehicleChange = new EventEmitter<string>();
  @Output() public resetVehicle = new EventEmitter<string>();

  public readonly itemHeightPx = 42;
  public readonly itemsPerPage = 5;
  public readonly panelHeightPx = this.itemHeightPx * this.itemsPerPage;
  public readonly filterControl = new FormControl(null);
  public hasNext = false;
  public isLoading = false;
  public selectedVehicleId: string;
  public vehicles$ = new BehaviorSubject<FleetVehicleDto[]>([]);
  public filteredVehicles$: Observable<FleetVehicleDto[]> = this.vehicles$.pipe(
    map((vehicles) => this.filterVehicles(vehicles)),
  );
  public readonly panelHeight$: Observable<number> = this.filteredVehicles$.pipe(
    map(({ length }) => {
      const itemsNum = Math.max(length, 1);
      return Math.min(itemsNum * this.itemHeightPx, this.panelHeightPx);
    }),
  );

  private offset = 0;
  private readonly limit = 30;
  private readonly destroyRef = inject(DestroyRef);
  public readonly icons = inject(ICONS);

  constructor(
    private readonly vehicleService: VehiclesService,
    private readonly host: ElementRef,
  ) {
    this.host.nativeElement.dataset.cy = 'vehicle-control';
  }

  public ngOnInit(): void {
    this.listenFilterChange();
  }

  public onChange = (_: string): void => {};
  public onTouched = (): void => {};
  public displayWithFn(vehicle: FleetVehicleDto): string {
    return vehicle ? vehicle.licencePlate : '';
  }
  public trackByFn = (_: number, vehicle: FleetVehicleDto): string => vehicle.id;

  public writeValue(vehicleId: string): void {
    if (!vehicleId) {
      this.resetControl();
      return;
    }

    this.vehicleService.getFleetVehicleById(this.fleetId, vehicleId).subscribe((vehicle) => {
      this.filterControl.setValue({ ...vehicle, licencePlate: vehicle.license_plate });
      this.selectedVehicleId = vehicleId;
    });
  }

  public registerOnChange(fn: () => void): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  public resetControl(): void {
    this.filterControl.reset('');
    this.selectedVehicleId = '';
    this.onChange(this.selectedVehicleId);
    this.resetVehicle.emit();
  }

  public handleChange(event: KeyboardEvent): void {
    if (!this.selectedVehicleId) return;

    const { value } = event.target as HTMLInputElement;
    const licencePlates = this.vehicles$.value.map(({ licencePlate }) => `${licencePlate}`);

    if (!licencePlates.includes(value)) {
      this.selectedVehicleId = '';
      this.onChange('');
    }
  }

  public onSelectionChange({ isUserInput, source: { value } }: MatOptionSelectionChange<FleetVehicleDto>): void {
    if (isUserInput) {
      this.selectedVehicleId = value.id;
      this.onChange(value.id);
      this.vehicleChange.emit(value.id);
    }
  }

  public handleScroll(index: number): void {
    if (index && index + this.itemsPerPage >= this.scroller.getDataLength() && !this.isLoading && this.hasNext) {
      this.getVehicles(false, this.filterControl.value).subscribe();
    }
  }

  private getVehicles(
    triggeredBySearch: boolean,
    filterValue: string | FleetVehicleDto = '',
  ): Observable<FleetVehicleCollectionDto> {
    if (typeof filterValue !== 'string') {
      this.setVehicles(EMPTY_RESPONSE, true);
      return of(EMPTY_RESPONSE);
    }

    this.isLoading = true;
    this.offset = triggeredBySearch ? 0 : this.offset + this.limit;

    return this.vehicleService
      .getFleetVehicles(this.fleetId, {
        licencePlate: filterValue,
        limit: this.limit,
        offset: this.offset,
      })
      .pipe(
        catchError(() => of(EMPTY_RESPONSE)),
        tap((vehicles) => this.setVehicles(vehicles, triggeredBySearch)),
        finalize(() => {
          this.isLoading = false;
        }),
      );
  }

  private filterVehicles(vehicles: FleetVehicleDto[]): FleetVehicleDto[] {
    return vehicles.filter(({ id }) => this.selectedVehicleId !== id);
  }

  private setVehicles({ data, total }: FleetVehicleCollectionDto, triggeredBySearch: boolean): void {
    this.hasNext = this.vehicles$.value.length + data.length < total;
    this.vehicles$.next(triggeredBySearch ? data : [...this.vehicles$.value, ...data]);
    this.autocomplete.options.forEach((option) => option.deselect());
  }

  private listenFilterChange(): void {
    this.filterControl.valueChanges
      .pipe(
        startWith(''),
        debounceTime(DEBOUNCE_TIME_MS),
        switchMap((value: string | FleetVehicleDto) => this.getVehicles(true, value)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }
}
