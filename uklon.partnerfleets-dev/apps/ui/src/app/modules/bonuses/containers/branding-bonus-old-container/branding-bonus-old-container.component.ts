import { AsyncPipe, NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatOption, MatSelect } from '@angular/material/select';
import {
  AnalyticsBrandingBonusBase,
  AnalyticsVehicleBase,
  BrandingBonusCalculationPeriodOldDto,
  BrandingBonusCalculationQueryOldDto,
  BrandingBonusCalculationsProgramOldDto,
  BrandingBonusProgramsCollectionOld,
  BrandingBonusProgramsOldDto,
  FleetAnalyticsEventType,
} from '@data-access';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { AnalyticsService } from '@ui/core/services/analytics.service';
import { LoadingIndicatorService } from '@ui/core/services/loading-indicator.service';
import { StorageFiltersKey, StorageService, userRoleKey } from '@ui/core/services/storage.service';
import { ToastService } from '@ui/core/services/toast.service';
import { AccountState } from '@ui/core/store/account/account.reducer';
import { selectedFleetId } from '@ui/core/store/account/account.selectors';
import { BrandingBonusProgramOldComponent } from '@ui/modules/bonuses/components/branding-bonus-program-old/branding-bonus-program-old.component';
import { BrandingBonusProgramsListOldComponent } from '@ui/modules/bonuses/components/branding-bonus-programs-list-old/branding-bonus-programs-list-old.component';
import { BonusExportOldService } from '@ui/modules/bonuses/services/bonus-export-old.service';
import { BonusOldService } from '@ui/modules/bonuses/services/bonus-old.service';
import { CSVFileRef } from '@ui/shared';
import { EmptyStateComponent } from '@ui/shared/components/empty-state/empty-state.component';
import { EmptyStates } from '@ui/shared/components/empty-state/empty-states';
import {
  FiltersActionButtonDirective,
  FiltersContainerComponent,
} from '@ui/shared/components/filters-container/filters-container.component';
import { LoaderButtonComponent } from '@ui/shared/components/loader-button/loader-button.component';
import { VehicleAutocompleteComponent } from '@ui/shared/components/vehicle-autocomplete/vehicle-autocomplete.component';
import { DEFAULT_LIMIT } from '@ui/shared/consts';
import { LetDirective } from '@ui/shared/directives/let.directive';
import { MaxPipe } from '@ui/shared/pipes/max/max.pipe';
import { MinPipe } from '@ui/shared/pipes/min/min.pipe';
import { Seconds2DatePipe } from '@ui/shared/pipes/seconds-2-date/seconds-2-date.pipe';
import { CSVFileLoadingService, CSVFileType } from '@ui/shared/services/csv-file-loading.service';
import { BehaviorSubject, filter, map, Observable, of } from 'rxjs';
import { pairwise, switchMap, take } from 'rxjs/operators';

import { ScrolledDirectiveModule } from '@uklon/fleets/angular/cdk';

interface BonusesFilters {
  calculation: BrandingBonusCalculationPeriodOldDto;
  vehicle_id: string;
}

@Component({
  selector: 'upf-branding-bonus-old-container',
  standalone: true,
  templateUrl: './branding-bonus-old-container.component.html',
  styleUrls: ['./branding-bonus-old-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    LetDirective,
    AsyncPipe,
    FiltersContainerComponent,
    ReactiveFormsModule,
    MatFormField,
    TranslateModule,
    MatSelect,
    MatLabel,
    MatOption,
    MinPipe,
    MaxPipe,
    VehicleAutocompleteComponent,
    LoaderButtonComponent,
    MatIcon,
    NgTemplateOutlet,
    ScrolledDirectiveModule,
    BrandingBonusProgramOldComponent,
    BrandingBonusProgramsListOldComponent,
    FiltersActionButtonDirective,
    EmptyStateComponent,
    Seconds2DatePipe,
  ],
  providers: [BonusExportOldService],
})
export class BrandingBonusOldContainerComponent implements OnInit, OnChanges {
  @ViewChild('brandingBonusProgram')
  public brandingBonusesProgramComponent!: BrandingBonusProgramOldComponent;

  @Input({ required: true }) public fleetId: string;
  @Input({ required: true }) public walletId: string;
  @Input({ required: true }) public calculationPeriods: BrandingBonusCalculationPeriodOldDto[];

  public readonly isDownloading$ = this.csvFileLoadingService.isLoading$(CSVFileType.BRANDING_BONUS_OLD);
  public selectedFleetId$: Observable<string> = this.store.select(selectedFleetId).pipe(
    filter(Boolean),
    pairwise(),
    filter(([prev, current]) => prev !== current),
    map(([_, current]) => current),
  );

  public readonly emptyState = EmptyStates;
  public readonly filterKey = StorageFiltersKey.BRANDING_BONUS_OLD_TAB;
  public readonly filtersForm = new FormGroup({
    vehicle_id: new FormControl<string>(''),
    calculation: new FormControl<BrandingBonusCalculationPeriodOldDto>(null),
  });

  public bonusProgram$ = new BehaviorSubject<BrandingBonusCalculationsProgramOldDto>(null);
  public brandingBonusPrograms$ = new BehaviorSubject<BrandingBonusProgramsOldDto[]>(null);

  private isLoading = false;
  private hasNext = false;
  private offset = 0;

  constructor(
    private readonly bonusOldService: BonusOldService,
    private readonly bonusExportOldService: BonusExportOldService,
    private readonly toastService: ToastService,
    private readonly store: Store<AccountState>,
    private readonly analytics: AnalyticsService,
    private readonly storage: StorageService,
    private readonly csvFileLoadingService: CSVFileLoadingService,
    private readonly destroyRef: DestroyRef,
    private readonly loaderService: LoadingIndicatorService,
  ) {}

  public ngOnInit(): void {
    this.resetFiltersForm();
  }

  public ngOnChanges({ calculationPeriods }: SimpleChanges): void {
    const filtersFromStorage: BonusesFilters = this.storage.get(StorageFiltersKey.BRANDING_BONUS_OLD_TAB);
    const periods = calculationPeriods?.currentValue;

    if (periods?.length > 0 && (!filtersFromStorage || !filtersFromStorage?.calculation)) {
      this.filtersForm.get('calculation').setValue(periods[0]);
    }
  }

  public onFiltersChange(filters: BonusesFilters, calculationId?: string): void {
    if (!filters || this.calculationPeriods.length === 0) return;

    if (filters?.calculation?.calculation_id) {
      this.getBrandingBonusProgram(calculationId || filters.calculation.calculation_id);
    }

    this.analytics.reportEvent<AnalyticsVehicleBase>(FleetAnalyticsEventType.BONUSES_VEHICLES_FILTER, {
      user_access: this.storage.get(userRoleKey),
      vehicle_id: filters.vehicle_id,
    });

    this.offset = 0;

    if (this.calculationPeriods.length > 0) {
      let payload: BonusesFilters;

      if (calculationId) {
        payload = {
          ...filters,
          calculation: {
            ...filters.calculation,
            calculation_id: calculationId,
          },
        };
      }

      this.getBrandingBonusPrograms(calculationId ? payload : filters);
    }
  }

  public onLoadNext(): void {
    if (!this.hasNext || this.isLoading) {
      return;
    }

    this.offset += DEFAULT_LIMIT;

    if (this.calculationPeriods.length > 0) {
      this.getBrandingBonusPrograms(this.filtersForm.getRawValue(), true);
    }
  }

  public handleExportClick(): void {
    this.csvFileLoadingService.startLoading(CSVFileType.BRANDING_BONUS_OLD);

    const bonusesDataForCSVFile = this.getAllBrandingBonusPrograms(
      {
        calculation: this.filtersForm.getRawValue()?.calculation,
        vehicle_id: this.filtersForm.getRawValue()?.vehicle_id,
      },
      [],
      0,
    ).pipe(
      takeUntilDestroyed(this.destroyRef),
      map((items: BrandingBonusProgramsOldDto[]) =>
        this.bonusExportOldService.convertToCsv(
          items,
          this.bonusProgram$.getValue(),
          this.filtersForm.getRawValue()?.calculation?.period,
        ),
      ),
    );

    const fileName = this.bonusExportOldService.getFilename();
    const csvRef = new CSVFileRef(bonusesDataForCSVFile, fileName, (fileData: string) => {
      this.bonusExportOldService.downloadFile(fileName, fileData);
    });

    csvRef
      .hasError()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.toastService.error('Bonuses.CSV.Notification.Error');
        this.csvFileLoadingService.finishLoading(CSVFileType.BRANDING_BONUS_OLD);
      });

    csvRef
      .isSuccessful()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((filename) => {
        this.toastService.success('Bonuses.CSV.Notification.Success', { filename });
        this.csvFileLoadingService.finishLoading(CSVFileType.BRANDING_BONUS_OLD);
      });

    csvRef.download();
  }

  public resetFiltersForm(): void {
    this.filtersForm.reset();
    this.brandingBonusesProgramComponent?.resetBrandingTypeControl();

    this.removeStorageIfNewData(this.calculationPeriods);

    if (this.calculationPeriods.length > 0) {
      this.filtersForm.patchValue({ calculation: this.calculationPeriods[0] });
    }
  }

  public comparePeriodsFn(
    obj1: BrandingBonusCalculationPeriodOldDto,
    obj2: BrandingBonusCalculationPeriodOldDto,
  ): boolean {
    return obj1?.calculation_id === obj2?.calculation_id;
  }

  public toggleBrandingTypeDropdown(opened: boolean): void {
    this.analytics.reportEvent<AnalyticsBrandingBonusBase>(FleetAnalyticsEventType.BONUSES_BRANDING_TYPE_DROPDOWN, {
      state: opened,
    });
  }

  public toggleBrandingPrograms(opened: boolean): void {
    this.analytics.reportEvent<AnalyticsBrandingBonusBase>(FleetAnalyticsEventType.TOGGLE_BRANDING_PROGRAMS, {
      state: opened,
    });
  }

  public getBrandingBonusProgram(calculationId: string): void {
    this.bonusOldService
      .getBrandingBonusCalculationsProgram(calculationId)
      .pipe(take(1))
      .subscribe((data) => this.bonusProgram$.next(data));
  }

  private getAllBrandingBonusPrograms(
    { calculation, vehicle_id }: BonusesFilters,
    bonusItems: BrandingBonusProgramsOldDto[],
    offset: number,
  ): Observable<BrandingBonusProgramsOldDto[]> {
    return this.bonusOldService
      .getBrandingBonusPrograms(
        { wallet_id: this.walletId, offset, limit: DEFAULT_LIMIT, vehicle_id: vehicle_id || '' },
        calculation.calculation_id,
      )
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        switchMap(({ has_more_items, items }: BrandingBonusProgramsCollectionOld) => {
          return has_more_items
            ? this.getAllBrandingBonusPrograms(
                { calculation, vehicle_id },
                [...bonusItems, ...items],
                offset + DEFAULT_LIMIT,
              )
            : of([...bonusItems, ...items]);
        }),
      );
  }

  private getBrandingBonusPrograms({ calculation, vehicle_id }: BonusesFilters, loadMore = false): void {
    if (!calculation?.calculation_id) {
      return;
    }

    this.isLoading = true;
    this.offset = loadMore ? this.offset : 0;

    const query: BrandingBonusCalculationQueryOldDto = {
      wallet_id: this.walletId,
      offset: this.offset,
      limit: DEFAULT_LIMIT,
      vehicle_id: vehicle_id || '',
      calculation_id: calculation.calculation_id,
    };

    this.loaderService.show();
    this.bonusOldService
      .getBrandingBonusPrograms(query, calculation.calculation_id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: ({ items, has_more_items }) => {
          this.isLoading = false;
          this.hasNext = has_more_items;
          this.loaderService.hide();

          this.brandingBonusPrograms$.next(loadMore ? [...this.brandingBonusPrograms$.value, ...items] : items);
        },
        error: () => this.loaderService.hide(),
      });
  }

  private removeStorageIfNewData(calculationData: BrandingBonusCalculationPeriodOldDto[]): void {
    const storedData = JSON.parse(localStorage.getItem(StorageFiltersKey.BRANDING_BONUS_OLD_TAB));

    if (storedData?.calculation) {
      const foundNewCalculationData = calculationData.find(
        (item: BrandingBonusCalculationPeriodOldDto) => item.calculation_id === storedData?.calculation?.calculation_id,
      );

      if (foundNewCalculationData) {
        const isDifferent =
          JSON.stringify(storedData?.calculation?.brandingTypes) !==
          JSON.stringify(foundNewCalculationData.brandingTypes);

        if (isDifferent) {
          this.storage.delete(StorageFiltersKey.BRANDING_BONUS_OLD_TAB);
        }
      }
    }
  }
}
