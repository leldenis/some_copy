import { AsyncPipe, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import {
  AnalyticsDateFilter,
  AnalyticsUserRole,
  AnalyticsVehicleBase,
  DateRangeDto,
  FleetAnalyticsEventType,
  getCurrentWeek,
  VehicleOrderReportItemDto,
  VehicleOrderReportQueryDto,
  VehicleOrderReportsFiltersDto,
} from '@data-access';
import { TranslateModule } from '@ngx-translate/core';
import { AnalyticsService } from '@ui/core/services/analytics.service';
import { StorageFiltersKey, StorageService, userRoleKey } from '@ui/core/services/storage.service';
import { ToastService } from '@ui/core/services/toast.service';
import { VehicleOrderReportsListComponent } from '@ui/modules/orders/features/vehicle-order-reports/components/vehicle-order-reports-list/vehicle-order-reports-list.component';
import { VehicleOrderReportExporterService } from '@ui/modules/orders/features/vehicle-order-reports/services/vehicle-order-report-exporter.service';
import { VehicleOrderReportsService } from '@ui/modules/orders/features/vehicle-order-reports/services/vehicle-order-reports.service';
import { CSVFileRef, DateTimeRangeControlComponent, MAT_FORM_FIELD_IMPORTS } from '@ui/shared';
import { EmptyStateComponent } from '@ui/shared/components/empty-state/empty-state.component';
import { EmptyStates } from '@ui/shared/components/empty-state/empty-states';
import {
  FiltersActionButtonDirective,
  FiltersContainerComponent,
} from '@ui/shared/components/filters-container/filters-container.component';
import { LoaderButtonComponent } from '@ui/shared/components/loader-button/loader-button.component';
import { VehicleAutocompleteComponent } from '@ui/shared/components/vehicle-autocomplete/vehicle-autocomplete.component';
import { DEFAULT_LIMIT } from '@ui/shared/consts';
import { ReportStatsExplanationComponent } from '@ui/shared/dialogs/report-stats-explanation/report-stats-explanation.component';
import { CSVFileLoadingService, CSVFileType } from '@ui/shared/services/csv-file-loading.service';
import { BehaviorSubject, finalize, map, Observable, of, tap } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { ScrolledDirectiveModule } from '@uklon/fleets/angular/cdk';

@Component({
  selector: 'upf-vehicle-order-reports',
  standalone: true,
  imports: [
    MAT_FORM_FIELD_IMPORTS,
    FiltersContainerComponent,
    TranslateModule,
    ReactiveFormsModule,
    DateTimeRangeControlComponent,
    VehicleAutocompleteComponent,
    LoaderButtonComponent,
    FiltersActionButtonDirective,
    AsyncPipe,
    MatIcon,
    NgTemplateOutlet,
    ReportStatsExplanationComponent,
    EmptyStateComponent,
    VehicleOrderReportsListComponent,
    ScrolledDirectiveModule,
  ],
  templateUrl: './vehicle-order-reports.component.html',
  styleUrls: ['./vehicle-order-reports.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VehicleOrderReportsComponent {
  @Input({ required: true }) public fleetId: string;

  public readonly emptyState = EmptyStates;
  public readonly filterKey = StorageFiltersKey.VEHICLE_ORDER_REPORTS;

  public readonly filtersGroup = new FormGroup({
    period: new FormControl<DateRangeDto>(getCurrentWeek()),
    vehicle_id: new FormControl<string>(''),
  });

  public readonly reports$ = new BehaviorSubject<VehicleOrderReportItemDto[]>(null);
  public readonly isDownloading$ = this.csvFileLoadingService.isLoading$(CSVFileType.VEHICLE_REPORTS);

  private isLoading = false;
  private cursor = 0;
  private hasNext = false;
  private readonly limit = DEFAULT_LIMIT;

  constructor(
    private readonly vehicleOrderReportsService: VehicleOrderReportsService,
    private readonly vehicleOrderReportExporterService: VehicleOrderReportExporterService,
    private readonly toastService: ToastService,
    private readonly analytics: AnalyticsService,
    private readonly storage: StorageService,
    private readonly csvFileLoadingService: CSVFileLoadingService,
  ) {}

  public onFiltersChange(filters: VehicleOrderReportsFiltersDto): void {
    this.getVehicleOrderReports(filters);
  }

  public onLoadNext(): void {
    if (!this.hasNext || this.isLoading) {
      return;
    }

    this.getVehicleOrderReports(this.filtersGroup.getRawValue(), true);
  }

  public handleExportClick(): void {
    const { period, ...rest } = this.filtersGroup.getRawValue();
    this.csvFileLoadingService.startLoading(CSVFileType.VEHICLE_REPORTS);

    const csvReport = this.getAllVehicleOrderReports(
      {
        ...period,
        ...rest,
      },
      0,
      this.limit,
      [],
    ).pipe(map((items: VehicleOrderReportItemDto[]) => this.vehicleOrderReportExporterService.convertToCSV(items)));

    const csvFileName = this.vehicleOrderReportExporterService.createFilename(
      period.from,
      period.to,
      'VehicleOrderReportList.Csv.Filename',
    );

    const csvRef = new CSVFileRef(csvReport, csvFileName, (fileData: string) =>
      this.vehicleOrderReportExporterService.downloadFile(csvFileName, fileData),
    );

    this.analytics.reportEvent<AnalyticsUserRole>(FleetAnalyticsEventType.VEHICLES_REPORTS_EXPORT_CSV, {
      user_access: this.storage.get(userRoleKey),
    });

    csvRef.hasError().subscribe(() => {
      this.notifyExportFailed();
      this.csvFileLoadingService.finishLoading(CSVFileType.VEHICLE_REPORTS);
    });
    csvRef.isSuccessful().subscribe((filename) => {
      this.notifyExportSuccessful(filename);
      this.csvFileLoadingService.finishLoading(CSVFileType.VEHICLE_REPORTS);
    });
    csvRef.download();
  }

  public reportRangeChange({ from, to }: DateRangeDto): void {
    this.analytics.reportEvent<AnalyticsDateFilter>(FleetAnalyticsEventType.VEHICLES_REPORTS_DATE_FILTER, {
      user_access: this.storage.get(userRoleKey),
      start_date: from,
      end_date: to,
    });
  }

  public reportVehicleChange(id: string): void {
    this.analytics.reportEvent<AnalyticsVehicleBase>(FleetAnalyticsEventType.VEHICLES_REPORTS_VEHICLE_FILTER, {
      user_access: this.storage.get(userRoleKey),
      vehicle_id: id,
    });
  }

  private notifyExportSuccessful(filename: string): void {
    this.toastService.success('VehicleOrderReportList.Csv.Notification.Success', { filename });
  }

  private notifyExportFailed(): void {
    this.toastService.error('VehicleOrderReportList.Csv.Notification.Error');
  }

  private getAllVehicleOrderReports(
    { from, to, ...rest }: VehicleOrderReportQueryDto,
    cursor: number,
    limit: number,
    reports: VehicleOrderReportItemDto[],
  ): Observable<VehicleOrderReportItemDto[]> {
    return this.vehicleOrderReportsService
      .getVehicleOrderReports(this.fleetId, {
        from,
        to,
        ...rest,
        cursor,
        limit,
      })
      .pipe(
        switchMap(({ next_cursor, items }) => {
          return next_cursor.startsWith('0')
            ? of([...reports, ...items])
            : this.getAllVehicleOrderReports({ from, to, ...rest }, Number(next_cursor), limit, [...reports, ...items]);
        }),
      );
  }

  private getVehicleOrderReports({ period, ...rest }: VehicleOrderReportsFiltersDto, loadMore = false): void {
    this.isLoading = true;
    this.cursor = loadMore ? this.cursor : 0;
    this.vehicleOrderReportsService
      .getVehicleOrderReports(this.fleetId, {
        ...period,
        ...rest,
        cursor: this.cursor,
        limit: this.limit,
      })
      .pipe(
        tap(({ next_cursor }) => {
          this.hasNext = !!Number(next_cursor);
          this.cursor = Number(next_cursor);
        }),
        map(({ items }) => items),
        finalize((): void => {
          this.isLoading = false;
        }),
      )
      .subscribe((items) => this.reports$.next(loadMore ? [...this.reports$.value, ...items] : items));
  }
}
