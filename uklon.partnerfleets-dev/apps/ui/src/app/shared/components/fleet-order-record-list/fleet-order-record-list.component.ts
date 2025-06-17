import { SelectionModel } from '@angular/cdk/collections';
import { CdkTableModule } from '@angular/cdk/table';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { OrderStatus } from '@constant';
import { FeeType, FleetOrderRecordDto } from '@data-access';
import { TranslateModule } from '@ngx-translate/core';
import { CorePaths } from '@ui/core/models/core-paths';
import { DriverPaths } from '@ui/modules/drivers/models/driver-paths';
import { OrdersPaths } from '@ui/modules/orders/models/orders-paths';
import { VehiclePaths } from '@ui/modules/vehicles/models/vehicle-paths';
import { StatusBadgeComponent, UIService, NormalizeStringPipe } from '@ui/shared';
import { OrderAdditionalIncomeInfoComponent } from '@ui/shared/components/order-additional-income-info/order-additional-income-info.component';
import { ProductTypeChipComponent } from '@ui/shared/components/product-type-chip/product-type-chip.component';
import { RoutePointsComponent } from '@ui/shared/components/route-points/route-points.component';
import { ORDER_STATUS_COLOR } from '@ui/shared/consts';
import { LetDirective } from '@ui/shared/directives/let.directive';
import { MoneyPipe } from '@ui/shared/pipes/money';
import { Seconds2DatePipe } from '@ui/shared/pipes/seconds-2-date/seconds-2-date.pipe';
import { Seconds2TimePipe } from '@ui/shared/pipes/seconds-2-time/seconds-2-time.pipe';
import { NgxTippyModule } from 'ngx-tippy-wrapper';

export type FleetOrderRecordListColumn =
  | 'Driver'
  | 'PickupTime'
  | 'Route'
  | 'CostAndDistance'
  | 'PaymentType'
  | 'ProductType'
  | 'Status'
  | 'LicensePlate';

export interface CdkTableHeaderCellViewModel {
  primaryCaption: string;
  secondaryCaption?: string;
}

export const DEFAULT_COLUMN_VIEW_MODELS = new Map<FleetOrderRecordListColumn, CdkTableHeaderCellViewModel>([
  [
    'LicensePlate',
    {
      primaryCaption: 'FleetOrderRecordList.Header.PrimaryCaption.LicensePlate',
    },
  ],
  [
    'Driver',
    {
      primaryCaption: 'FleetOrderRecordList.Header.PrimaryCaption.Driver',
    },
  ],
  [
    'PickupTime',
    {
      primaryCaption: 'FleetOrderRecordList.Header.PrimaryCaption.PickupTime',
    },
  ],
  [
    'Route',
    {
      primaryCaption: 'FleetOrderRecordList.Header.PrimaryCaption.Route',
    },
  ],
  [
    'CostAndDistance',
    {
      primaryCaption: 'Orders.Trips.List.OrderCost',
      secondaryCaption: 'FleetOrderRecordList.Header.SecondaryCaption.CostAndDistance',
    },
  ],
  [
    'PaymentType',
    {
      primaryCaption: 'FleetOrderRecordList.Header.PrimaryCaption.PaymentType',
    },
  ],
  [
    'ProductType',
    {
      primaryCaption: 'FleetOrderRecordList.Header.PrimaryCaption.ProductType',
    },
  ],
  [
    'Status',
    {
      primaryCaption: 'FleetOrderRecordList.Header.PrimaryCaption.Status',
    },
  ],
]);

export const PAYMENT_TYPE_ICON = new Map<FeeType, string>([
  [FeeType.CASH, 'i-cash'],
  [FeeType.CASHLESS, 'i-card'],
  [FeeType.MIXED, 'i-fee-type-mixed'],
]);

export const FLEET_ORDER_RECORD_STATUS_INTL = new Map<OrderStatus, string>([
  [OrderStatus.COMPLETED, 'Common.Enums.OrderStatus.Completed'],
  [OrderStatus.CANCELED, 'Common.Enums.OrderStatus.Canceled'],
  [OrderStatus.RUNNING, 'Common.Enums.OrderStatus.Running'],
]);

@Component({
  selector: 'upf-fleet-order-record-list',
  standalone: true,
  imports: [
    CommonModule,
    CdkTableModule,
    TranslateModule,
    RouterLink,
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
    StatusBadgeComponent,
    NgxTippyModule,
    LetDirective,
    RoutePointsComponent,
    OrderAdditionalIncomeInfoComponent,
    ProductTypeChipComponent,
    NormalizeStringPipe,
    MoneyPipe,
    Seconds2DatePipe,
    Seconds2TimePipe,
  ],
  templateUrl: './fleet-order-record-list.component.html',
  styleUrls: ['./fleet-order-record-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FleetOrderRecordListComponent implements OnInit {
  @Input() public dataSource: FleetOrderRecordDto[] = [];
  @Input() public selected: number;

  @Input() public set columns(columns: FleetOrderRecordListColumn[]) {
    if (!columns) return;
    this.setColumns(columns);
  }

  public readonly paymentTypeIconMap = PAYMENT_TYPE_ICON;
  public readonly headerCellsViewModel = DEFAULT_COLUMN_VIEW_MODELS;
  public readonly selection = new SelectionModel<number>();
  public readonly orderDetailsPath = `/${CorePaths.WORKSPACE}/${CorePaths.ORDERS}/${OrdersPaths.DETAILS}`;
  public readonly corePaths = CorePaths;
  public readonly driverPaths = DriverPaths;
  public readonly vehiclePaths = VehiclePaths;
  public readonly statusColor = ORDER_STATUS_COLOR;
  public readonly isMobileView$ = this.uiService.breakpointMatch();

  public headerRowColumns: FleetOrderRecordListColumn[];
  public rowColumns: (FleetOrderRecordListColumn | 'Toggle' | 'ExpandedView')[];
  public orderStatus = OrderStatus;

  constructor(private readonly uiService: UIService) {}

  public ngOnInit(): void {
    if (!this.headerRowColumns || !this.rowColumns) {
      this.setColumns([...DEFAULT_COLUMN_VIEW_MODELS.keys()]);
    }
  }

  public toggle(index: number): void {
    this.selection.toggle(index);
  }

  private setColumns(columns: FleetOrderRecordListColumn[]): void {
    this.headerRowColumns = [...columns];
    this.rowColumns = [...columns, 'Toggle', 'ExpandedView'];
  }
}
