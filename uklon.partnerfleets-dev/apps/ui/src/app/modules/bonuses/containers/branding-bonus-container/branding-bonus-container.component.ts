import { AsyncPipe, NgTemplateOutlet } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  OnChanges,
  signal,
  SimpleChanges,
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatOption, MatSelect } from '@angular/material/select';
import {
  AnalyticsBrandingBonusBase,
  AnalyticsVehicleBase,
  BonusBrandingProgramNameDto,
  BrandingBonusCalculationPeriodDto,
  BrandingBonusProgramCalculationDto,
  BrandingCalculationsProgramDto,
  FleetAnalyticsEventType,
} from '@data-access';
import { TranslateModule } from '@ngx-translate/core';
import { AnalyticsService } from '@ui/core/services/analytics.service';
import { LoadingIndicatorService } from '@ui/core/services/loading-indicator.service';
import { StorageFiltersKey, StorageService, userRoleKey } from '@ui/core/services/storage.service';
import { BrandingBonusExportBtnComponent } from '@ui/modules/bonuses/components/branding-bonus-export-btn/branding-bonus-export-btn.component';
import { BrandingBonusProgramListComponent } from '@ui/modules/bonuses/components/branding-bonus-program-list/branding-bonus-program-list.component';
import { BrandingProgramDetailsComponent } from '@ui/modules/bonuses/components/branding-program-details/branding-program-details.component';
import { BonusExportService } from '@ui/modules/bonuses/services/bonus-export.service';
import { BonusService } from '@ui/modules/bonuses/services/bonus.service';
import { EmptyStateComponent } from '@ui/shared/components/empty-state/empty-state.component';
import { EmptyStates } from '@ui/shared/components/empty-state/empty-states';
import {
  FiltersActionButtonDirective,
  FiltersContainerComponent,
} from '@ui/shared/components/filters-container/filters-container.component';
import { VehicleAutocompleteComponent } from '@ui/shared/components/vehicle-autocomplete/vehicle-autocomplete.component';
import { MaxPipe } from '@ui/shared/pipes/max/max.pipe';
import { MinPipe } from '@ui/shared/pipes/min/min.pipe';
import { Seconds2DatePipe } from '@ui/shared/pipes/seconds-2-date/seconds-2-date.pipe';
import { CSVFileLoadingService, CSVFileType } from '@ui/shared/services/csv-file-loading.service';
import { take } from 'rxjs/operators';

interface BrandingFilters {
  program_id: string;
  calculation: BrandingBonusCalculationPeriodDto;
  vehicle_id: string;
}

@Component({
  selector: 'upf-branding-bonus-container',
  standalone: true,
  imports: [
    FiltersContainerComponent,
    ReactiveFormsModule,
    MatFormField,
    TranslateModule,
    MatSelect,
    MatOption,
    MatLabel,
    MinPipe,
    MaxPipe,
    VehicleAutocompleteComponent,
    BrandingBonusExportBtnComponent,
    AsyncPipe,
    NgTemplateOutlet,
    BrandingProgramDetailsComponent,
    BrandingBonusProgramListComponent,
    FiltersActionButtonDirective,
    EmptyStateComponent,
    Seconds2DatePipe,
  ],
  templateUrl: './branding-bonus-container.component.html',
  styleUrl: './branding-bonus-container.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [BonusExportService],
})
export class BrandingBonusContainerComponent implements OnChanges, AfterViewInit {
  public readonly fleetId = input.required<string>();
  public readonly regionId = input.required<number>();

  public readonly programsNames = signal<BonusBrandingProgramNameDto[]>([]);
  public readonly calculationPeriods = signal<BrandingBonusCalculationPeriodDto[]>([]);
  public readonly programDetails = signal<BrandingCalculationsProgramDto>(null);
  public readonly programsItems = signal<BrandingBonusProgramCalculationDto[]>([]);

  public readonly emptyState = EmptyStates;
  public readonly filterKey = StorageFiltersKey.BRANDING_BONUS_TAB;
  public readonly filtersForm = new FormGroup({
    program_id: new FormControl<string>(''),
    vehicle_id: new FormControl<string>(''),
    calculation: new FormControl<BrandingBonusCalculationPeriodDto>(null),
  });

  private readonly bonusService = inject(BonusService);
  private readonly analytics = inject(AnalyticsService);
  private readonly storage = inject(StorageService);
  private readonly csvFileLoadingService = inject(CSVFileLoadingService);
  private readonly loaderService = inject(LoadingIndicatorService);

  public readonly isDownloading$ = this.csvFileLoadingService.isLoading$(CSVFileType.BRANDING_BONUS);

  public ngAfterViewInit(): void {
    if (!this.filtersForm.value?.program_id) {
      this.filtersForm.get('calculation').disable({});
    }

    this.init();
  }

  public ngOnChanges({ regionId }: SimpleChanges): void {
    if (!regionId.firstChange && regionId.currentValue) {
      this.resetFiltersAndData();
      this.init();
    }
  }

  public changeProgram(programId: string): void {
    this.filtersForm.patchValue({
      calculation: null,
      vehicle_id: '',
    });

    this.resetLoadedData();
    this.loadCalculationPeriods(programId);
  }

  public changePeriod(calculation: BrandingBonusCalculationPeriodDto): void {
    this.loadProgramDetails(calculation.calculation_id);
    this.loadBrandingProgramsCalculations(calculation.calculation_id);
  }

  public changeVehicle(): void {
    const calculationId = this.filtersForm.get('calculation').value?.calculation_id;

    if (calculationId && this.filtersForm.get('program_id').value) {
      this.loadBrandingProgramsCalculations(calculationId);
    }

    this.analytics.reportEvent<AnalyticsVehicleBase>(FleetAnalyticsEventType.BONUSES_VEHICLES_FILTER, {
      user_access: this.storage.get(userRoleKey),
      vehicle_id: this.filtersForm.get('vehicle_id')?.value,
    });
  }

  public resetFiltersAndData(): void {
    this.filtersForm.reset();
    this.filtersForm.get('calculation').disable();
    this.resetLoadedData();
  }

  public comparePeriodsFn(obj1: BrandingBonusCalculationPeriodDto, obj2: BrandingBonusCalculationPeriodDto): boolean {
    return obj1?.calculation_id === obj2?.calculation_id;
  }

  public toggleBrandingPrograms(opened: boolean): void {
    this.analytics.reportEvent<AnalyticsBrandingBonusBase>(FleetAnalyticsEventType.TOGGLE_BRANDING_PROGRAMS, {
      state: opened,
    });
  }

  private init(): void {
    this.loadBrandingProgramNames();

    const filtersStorage: BrandingFilters = this.storage.get(StorageFiltersKey.BRANDING_BONUS_TAB);

    if (filtersStorage?.program_id) {
      this.loadCalculationPeriods(filtersStorage.program_id);
    }

    if (filtersStorage?.program_id && filtersStorage?.calculation?.calculation_id) {
      this.loadBrandingProgramsCalculations(filtersStorage?.calculation?.calculation_id);
      this.loadProgramDetails(filtersStorage?.calculation?.calculation_id);
    }
  }

  private loadBrandingProgramNames(): void {
    this.bonusService
      .getBrandingProgramNames(this.regionId())
      .pipe(take(1))
      .subscribe((items) => this.programsNames.set(items));
  }

  private loadCalculationPeriods(programId: string): void {
    this.bonusService
      .getBrandingCalculationPeriods(this.fleetId(), programId)
      .pipe(take(1))
      .subscribe((periods) => {
        this.filtersForm.get('calculation').enable({ emitEvent: false });
        this.calculationPeriods.set(periods);
      });
  }

  private loadBrandingProgramsCalculations(calculationId: string): void {
    this.loaderService.show();
    this.bonusService
      .getBrandingProgramsCalculations(calculationId, this.fleetId(), this.filtersForm.get('vehicle_id')?.value)
      .pipe(take(1))
      .subscribe((collection) => {
        this.programsItems.set(collection.items);
        this.loaderService.hide();
      });
  }

  private loadProgramDetails(calculationId: string): void {
    this.bonusService
      .getBrandingProgramDetails(calculationId)
      .pipe(take(1))
      .subscribe((data) => {
        this.programDetails.set(data);
      });
  }

  private resetLoadedData(): void {
    this.calculationPeriods.set([]);
    this.programDetails.set(null);
    this.programsItems.set([]);
  }
}
