import { AsyncPipe, TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import {
  AnalyticsUserRole,
  FleetAnalyticsEventType,
  FleetOrderRecordDto,
  FleetOrderRecordCollectionQueryDto,
} from '@data-access';
import { Store } from '@ngrx/store';
import { AnalyticsService } from '@ui/core/services/analytics.service';
import { StorageService, userRoleKey } from '@ui/core/services/storage.service';
import { TripsFilterComponent } from '@ui/modules/orders/features/trips/components/trips-filter/trips-filter.component';
import { TripsListComponent } from '@ui/modules/orders/features/trips/components/trips-list/trips-list.component';
import { OrdersExporterService } from '@ui/modules/orders/services';
import { OrdersFeatureActionGroup } from '@ui/modules/orders/store/actions/orders.actions';
import {
  InfiniteCollectionState,
  OrdersFeatureState,
  ProgressState,
} from '@ui/modules/orders/store/reducers/orders.reducer';
import { selectError, selectOrderRecordCollection } from '@ui/modules/orders/store/selectors/orders.selectors';
import { EmptyStateComponent } from '@ui/shared/components/empty-state/empty-state.component';
import { EmptyStates } from '@ui/shared/components/empty-state/empty-states';
import { DEFAULT_LIMIT } from '@ui/shared/consts';
import { WhatIsMerchantComponent } from '@ui/shared/dialogs/what-is-merchant/what-is-merchant.component';
import { CSVFileLoadingService, CSVFileType } from '@ui/shared/services/csv-file-loading.service';

import { ScrolledDirectiveModule } from '@uklon/fleets/angular/cdk';

import { OrderFilterDto } from '../../../../models';

@Component({
  selector: 'upf-trips',
  standalone: true,
  imports: [
    AsyncPipe,
    TripsFilterComponent,
    WhatIsMerchantComponent,
    TripsListComponent,
    EmptyStateComponent,
    ScrolledDirectiveModule,
  ],
  providers: [OrdersExporterService, TitleCasePipe],
  templateUrl: './trips.component.html',
  styleUrls: ['./trips.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TripsComponent {
  @Input() public fleetId: string;

  public readonly emptyStatesRef = EmptyStates;
  public readonly analyticsEvents = FleetAnalyticsEventType;

  public query: FleetOrderRecordCollectionQueryDto;
  public orders$ = this.store.select(selectOrderRecordCollection);
  public error$ = this.store.select(selectError);
  public readonly isDownloading$ = this.csvFileLoadingService.isLoading$(CSVFileType.TRIPS);

  private readonly limit = DEFAULT_LIMIT;

  constructor(
    private readonly store: Store<OrdersFeatureState>,
    private readonly analytics: AnalyticsService,
    private readonly storage: StorageService,
    private readonly ordersExporterService: OrdersExporterService,
    private readonly csvFileLoadingService: CSVFileLoadingService,
  ) {}

  public handleScrolled({
    status,
    hasNext,
    cursor,
  }: InfiniteCollectionState<FleetOrderRecordDto> & ProgressState): void {
    if (status === 'progress' || !hasNext) return;

    this.store.dispatch(OrdersFeatureActionGroup.queryChanged({ ...this.query, cursor }));
  }

  public onFiltersChange(filter: OrderFilterDto): void {
    const {
      dateRange: { from, to },
      driverId,
      productType,
      licencePlate,
      status,
    } = filter;

    const query: FleetOrderRecordCollectionQueryDto = {
      ...this.query,
      limit: this.limit,
      fleetId: this.fleetId,
      licencePlate: licencePlate.replace(/\s/g, ''),
      productType,
      status,
      driverId,
      from,
      to,
    };

    this.query = query;
    this.store.dispatch(OrdersFeatureActionGroup.queryChanged(query));
    this.reportUserRole(FleetAnalyticsEventType.ORDERS_APPLY_FILTERS);
  }

  public reportUserRole(eventType: FleetAnalyticsEventType): void {
    this.analytics.reportEvent<AnalyticsUserRole>(eventType, {
      user_access: this.storage.get(userRoleKey || ''),
    });
  }

  public handleCsvExport(): void {
    this.ordersExporterService.exportCsv(this.query, this.limit);
  }
}
