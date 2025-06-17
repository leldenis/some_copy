import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { OrderStatus, ProductType } from '@constant';
import { FleetOrderRecordDto, FleetOrderRecordCollectionQueryDto, getCurrentWeek } from '@data-access';
import { TranslateModule } from '@ngx-translate/core';
import { StorageFiltersKey } from '@ui/core/services/storage.service';
import { OrdersService } from '@ui/modules/orders/services';
import { FleetVehicleOrdersFiltersDto } from '@ui/modules/vehicles/models/vehicle-filter.dto';
import {
  DateTimeRangeControlComponent,
  DriversAutocompleteComponent,
  NormalizeStringPipe,
  ProgressSpinnerComponent,
} from '@ui/shared';
import { EmptyStateComponent } from '@ui/shared/components/empty-state/empty-state.component';
import { EmptyStates } from '@ui/shared/components/empty-state/empty-states';
import { FiltersContainerComponent } from '@ui/shared/components/filters-container/filters-container.component';
import {
  FLEET_ORDER_RECORD_STATUS_INTL,
  FleetOrderRecordListColumn,
  FleetOrderRecordListComponent,
} from '@ui/shared/components/fleet-order-record-list/fleet-order-record-list.component';
import { PRODUCT_TYPES } from '@ui/shared/consts/product-types.const';
import { isNil, omitBy } from 'lodash';
import { BehaviorSubject } from 'rxjs';
import { finalize, map, tap } from 'rxjs/operators';

import { toServerDate } from '@uklon/angular-core';
import { ScrolledDirectiveModule } from '@uklon/fleets/angular/cdk';

@Component({
  selector: 'upf-vehicle-orders',
  standalone: true,
  imports: [
    CommonModule,
    FleetOrderRecordListComponent,
    TranslateModule,
    MatIconModule,
    MatFormFieldModule,
    MatSelectModule,
    ReactiveFormsModule,
    FiltersContainerComponent,
    ScrolledDirectiveModule,
    DriversAutocompleteComponent,
    ProgressSpinnerComponent,
    NormalizeStringPipe,
    EmptyStateComponent,
    DateTimeRangeControlComponent,
  ],
  templateUrl: './vehicle-orders.component.html',
  styleUrls: ['./vehicle-orders.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VehicleOrdersComponent {
  @Input() public vehicleId: string;
  @Input() public fleetId: string;
  @Input() public tabIndex: number;

  public readonly fleetOrderStatuses = [...FLEET_ORDER_RECORD_STATUS_INTL.keys()];
  public readonly fleetOrderStatusIntl = FLEET_ORDER_RECORD_STATUS_INTL;
  public readonly productTypes = PRODUCT_TYPES;
  public readonly emptyState = EmptyStates;
  public readonly filterKey = StorageFiltersKey.VEHICLE_ORDERS;

  public filtersGroup = new FormGroup({
    driverId: new FormControl<string>(''),
    date: new FormControl<{ from: number; to: number }>(getCurrentWeek()),
    status: new FormControl<OrderStatus | ''>(''),
    productType: new FormControl<ProductType | ''>(''),
  });
  public columns: FleetOrderRecordListColumn[] = [
    'Driver',
    'PickupTime',
    'Route',
    'CostAndDistance',
    'PaymentType',
    'ProductType',
    'Status',
  ];
  public isLoading: boolean;
  public readonly orders$ = new BehaviorSubject<FleetOrderRecordDto[]>(null);

  private cursor = -1;
  private hasNext: boolean;
  private readonly limit = 20;

  constructor(private readonly ordersService: OrdersService) {}

  public onLoadNext(): void {
    if (!this.hasNext || this.isLoading) return;
    this.getVehicleOrders(true);
  }

  public getVehicleOrders(loadMore: boolean = false, filters: FleetVehicleOrdersFiltersDto = null): void {
    this.isLoading = true;
    this.cursor = loadMore ? this.cursor : -1;

    const query = this.createFiltersQuery(filters);
    this.ordersService
      .getFleetOrders(query)
      .pipe(
        tap(({ cursor }) => {
          this.hasNext = Boolean(cursor);
          this.cursor = Number(cursor);
        }),
        map(({ items }) => items),
        finalize(() => {
          this.isLoading = false;
        }),
      )
      .subscribe((items) => {
        const orders = loadMore ? [...this.orders$.value, ...items] : items;
        this.orders$.next(orders);
      });
  }

  private createFiltersQuery(
    filters: FleetVehicleOrdersFiltersDto = null,
  ): Partial<FleetOrderRecordCollectionQueryDto> {
    const {
      date: { from, to },
      driverId,
      status,
      productType,
    } = filters || this.filtersGroup.value;
    let query: Partial<FleetOrderRecordCollectionQueryDto> = {
      driverId,
      productType,
      status,
      fleetId: this.fleetId,
      vehicleId: this.vehicleId,
      from: toServerDate(new Date(from)),
      to: toServerDate(new Date(to)),
      limit: this.limit,
      cursor: this.cursor,
    };

    query = omitBy(query, (value) => isNil(value) || value === '');
    return query;
  }
}
