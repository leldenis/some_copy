import { AsyncPipe, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, Input } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import {
  AnalyticsDateFilter,
  AnalyticsDriverBase,
  AnalyticsUserRole,
  DateRangeDto,
  DriversOrdersReportDto,
  FleetAnalyticsEventType,
  FleetOrdersFiltersDto,
  getCurrentWeek,
} from '@data-access';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { AnalyticsService } from '@ui/core/services/analytics.service';
import {
  StorageFiltersKey,
  StoragePaginationKey,
  StorageService,
  userRoleKey,
} from '@ui/core/services/storage.service';
import { ToastService } from '@ui/core/services/toast.service';
import { OrderReportListComponent } from '@ui/modules/orders/features/order-reports/components/order-report-list/order-report-list.component';
import { OrderReports, OrderReportsParamsDto } from '@ui/modules/orders/models/order-reports.dto';
import { OrderReportsActionsGroup } from '@ui/modules/orders/store/actions/orders-reports.actions';
import { OrdersReportsEffects } from '@ui/modules/orders/store/effects/orders-reports.effects';
import {
  getReports,
  getReportsHasNextPage,
  getReportsLoading,
} from '@ui/modules/orders/store/selectors/orders-reports.selectors';
import { DateTimeRangeControlComponent, DriversAutocompleteComponent, MAT_FORM_FIELD_IMPORTS } from '@ui/shared';
import { EmptyStateComponent } from '@ui/shared/components/empty-state/empty-state.component';
import {
  FiltersActionButtonDirective,
  FiltersContainerComponent,
} from '@ui/shared/components/filters-container/filters-container.component';
import { LoaderButtonComponent } from '@ui/shared/components/loader-button/loader-button.component';
import { DEFAULT_LIMIT } from '@ui/shared/consts';
import { ReportStatsExplanationComponent } from '@ui/shared/dialogs/report-stats-explanation/report-stats-explanation.component';
import { WhatIsMerchantComponent } from '@ui/shared/dialogs/what-is-merchant/what-is-merchant.component';
import { CSVFileLoadingService, CSVFileType } from '@ui/shared/services/csv-file-loading.service';
import { Observable } from 'rxjs';

import { ScrolledDirectiveModule } from '@uklon/fleets/angular/cdk';

import { OrdersToCsvExporterService } from '../../services/orders-to-csv-exporter.service';

@Component({
  selector: 'upf-order-reports',
  standalone: true,
  imports: [
    MAT_FORM_FIELD_IMPORTS,
    FiltersContainerComponent,
    ReactiveFormsModule,
    TranslateModule,
    DateTimeRangeControlComponent,
    DriversAutocompleteComponent,
    LoaderButtonComponent,
    AsyncPipe,
    MatIcon,
    NgTemplateOutlet,
    ReportStatsExplanationComponent,
    WhatIsMerchantComponent,
    OrderReportListComponent,
    EmptyStateComponent,
    ScrolledDirectiveModule,
    FiltersActionButtonDirective,
  ],
  templateUrl: './order-reports.component.html',
  styleUrls: ['./order-reports.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderReportsComponent {
  @Input() public fleetId: string;

  public readonly filterKey = StorageFiltersKey.ORDER_REPORTS;

  public readonly isDownloading$ = this.csvFileLoadingService.isLoading$(CSVFileType.DRIVERS_REPORTS);
  public readonly reports$: Observable<DriversOrdersReportDto[]> = this.store.select(getReports);
  public readonly loading$ = this.store.select(getReportsLoading);
  public readonly hasNextPage$ = this.store.select(getReportsHasNextPage);

  public filtersForm = new FormGroup({
    date: new FormControl<DateRangeDto>(getCurrentWeek()),
    driverId: new FormControl<string>(''),
  });

  private filtersValue: FleetOrdersFiltersDto = this.formValue;

  constructor(
    private readonly exporterService: OrdersToCsvExporterService,
    private readonly toastService: ToastService,
    private readonly analytics: AnalyticsService,
    private readonly storage: StorageService,
    private readonly store: Store<OrdersReportsEffects>,
    private readonly destroyRef: DestroyRef,
    private readonly csvFileLoadingService: CSVFileLoadingService,
  ) {}

  public get userRole(): string {
    return this.storage.get(userRoleKey) || '';
  }

  public get formValue(): FleetOrdersFiltersDto {
    return { ...this.filtersForm.getRawValue() };
  }

  public onFiltersChange(filters: FleetOrdersFiltersDto): void {
    this.reportFiltersChange(filters);
    this.getOrdersReports({ ...filters, offset: 0, limit: DEFAULT_LIMIT });
  }

  public handleExportClick(): void {
    const {
      date: { from: dateFrom, to: dateTo },
      ...rest
    } = this.formValue;

    this.csvFileLoadingService.startLoading(CSVFileType.DRIVERS_REPORTS);

    const fileRef = this.exporterService.export(this.fleetId, {
      dateFrom,
      dateTo,
      ...rest,
      offset: 0,
      limit: DEFAULT_LIMIT,
    } as OrderReportsParamsDto);

    fileRef
      .hasError()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.notifyExportFailed();
        this.csvFileLoadingService.finishLoading(CSVFileType.DRIVERS_REPORTS);
      });

    fileRef
      .isSuccessful()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((filename) => {
        this.notifyExportSuccessful(filename);
        this.csvFileLoadingService.finishLoading(CSVFileType.DRIVERS_REPORTS);
      });

    fileRef.download();

    this.reportUserRole(FleetAnalyticsEventType.ORDER_REPORT_EXPORT_CSV);
  }

  public handlerScrolled(): void {
    this.getOrdersReports({ ...this.formValue, limit: DEFAULT_LIMIT });
  }

  public onFiltersReset(): void {
    this.storage.set(StoragePaginationKey.ORDER_REPORTS, null);
    this.reportFiltersChange(this.formValue);
  }

  private reportUserRole(eventType: FleetAnalyticsEventType): void {
    this.analytics.reportEvent<AnalyticsUserRole>(eventType, {
      user_access: this.userRole,
    });
  }

  private getOrdersReports(params: OrderReports): void {
    this.store.dispatch(OrderReportsActionsGroup.getOrdersReports(params));
  }

  private notifyExportSuccessful(filename: string): void {
    this.toastService.success('Orders.Csv.Notification.Success', { filename });
  }

  private notifyExportFailed(): void {
    this.toastService.error('Orders.Csv.Notification.Error');
  }

  private reportFiltersChange(newFilters: FleetOrdersFiltersDto): void {
    const changedProperty = (Object.keys(newFilters) as (keyof FleetOrdersFiltersDto)[]).find(
      (key) => newFilters[key] !== this.filtersValue[key],
    );
    const filtersEmpty = Object.values(newFilters).every((value) => value === null);
    const filterHasValue = newFilters[changedProperty] !== null && newFilters[changedProperty] !== '';

    if (filtersEmpty || !changedProperty || !filterHasValue) return;

    if (changedProperty === 'date') {
      this.analytics.reportEvent<AnalyticsDateFilter>(FleetAnalyticsEventType.ORDER_REPORT_DATE_FILTER, {
        start_date: newFilters.date.from,
        end_date: newFilters.date.to,
        user_access: this.userRole,
      });
      return;
    }

    this.analytics.reportEvent<AnalyticsDriverBase>(FleetAnalyticsEventType.ORDER_REPORT_DRIVER_FILTER, {
      driver_id: newFilters.driverId,
      user_access: this.userRole,
    });

    this.filtersValue = newFilters;
  }
}
