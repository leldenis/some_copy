import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, Input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { OrderStatus, ProductType } from '@constant';
import {
  FleetDriverOrdersFiltersDto,
  FleetOrderRecordDto,
  FleetOrderRecordCollectionQueryDto,
  getCurrentWeek,
} from '@data-access';
import { TranslateModule } from '@ngx-translate/core';
import { StorageFiltersKey } from '@ui/core/services/storage.service';
import { DRIVER_ORDER_STATUS_INTL } from '@ui/modules/drivers/consts/driver-orders';
import { OrdersService } from '@ui/modules/orders/services';
import { DateTimeRangeControlComponent, NormalizeStringPipe, ProgressSpinnerComponent } from '@ui/shared';
import { EmptyStateComponent } from '@ui/shared/components/empty-state/empty-state.component';
import { EmptyStates } from '@ui/shared/components/empty-state/empty-states';
import { FiltersContainerComponent } from '@ui/shared/components/filters-container/filters-container.component';
import {
  FleetOrderRecordListColumn,
  FleetOrderRecordListComponent,
} from '@ui/shared/components/fleet-order-record-list/fleet-order-record-list.component';
import { PRODUCT_TYPES } from '@ui/shared/consts/product-types.const';
import { ICONS } from '@ui/shared/tokens';
import { isNil, omitBy } from 'lodash';
import { BehaviorSubject } from 'rxjs';
import { finalize, map, tap } from 'rxjs/operators';

import { toServerDate } from '@uklon/angular-core';
import { ScrolledDirectiveModule } from '@uklon/fleets/angular/cdk';

@Component({
  selector: 'upf-driver-orders',
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
    MatInputModule,
    ScrolledDirectiveModule,
    ProgressSpinnerComponent,
    NormalizeStringPipe,
    EmptyStateComponent,
    DateTimeRangeControlComponent,
  ],
  templateUrl: './driver-orders.component.html',
  styleUrls: ['./driver-orders.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DriverOrdersComponent {
  @Input() public driverId: string;
  @Input() public fleetId: string;
  @Input() public tabIndex: number;

  public readonly driverOrderStatuses = [...DRIVER_ORDER_STATUS_INTL.keys()];
  public readonly driverOrderStatusIntl = DRIVER_ORDER_STATUS_INTL;
  public readonly productTypes = PRODUCT_TYPES;
  public readonly emptyState = EmptyStates;
  public readonly filterKey = StorageFiltersKey.DRIVER_ORDERS;

  public filtersGroup = new FormGroup({
    licencePlate: new FormControl<string>(''),
    date: new FormControl<{ from: number; to: number }>(getCurrentWeek()),
    status: new FormControl<OrderStatus | ''>(''),
    productType: new FormControl<ProductType | ''>(''),
  });
  public columns: FleetOrderRecordListColumn[] = [
    'LicensePlate',
    'PickupTime',
    'Route',
    'CostAndDistance',
    'PaymentType',
    'ProductType',
    'Status',
  ];
  public isLoading: boolean;

  public readonly icons = inject(ICONS);
  public readonly ordersService = inject(OrdersService);

  public readonly orders$ = new BehaviorSubject<FleetOrderRecordDto[]>(null);

  private cursor = -1;
  private hasNext: boolean;
  private readonly limit = 20;

  public onLoadNext(): void {
    if (!this.hasNext || this.isLoading) return;
    this.getFleetOrders(true);
  }

  public getFleetOrders(loadMore: boolean = false, filters: FleetDriverOrdersFiltersDto = null): void {
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

  private createFiltersQuery(filters: FleetDriverOrdersFiltersDto = null): Partial<FleetOrderRecordCollectionQueryDto> {
    const {
      date: { from, to },
      licencePlate,
      status,
      productType,
    } = filters || this.filtersGroup.value;
    let query: Partial<FleetOrderRecordCollectionQueryDto> = {
      licencePlate,
      productType,
      status,
      fleetId: this.fleetId,
      driverId: this.driverId,
      from: toServerDate(new Date(from)),
      to: toServerDate(new Date(to)),
      limit: this.limit,
      cursor: this.cursor,
    };

    query = omitBy(query, (value) => isNil(value) || value === '');
    return query;
  }
}
