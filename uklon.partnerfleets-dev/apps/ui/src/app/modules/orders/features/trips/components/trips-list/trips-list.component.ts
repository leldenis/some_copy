import { AsyncPipe, NgClass, NgTemplateOutlet, TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { MatDivider } from '@angular/material/divider';
import { MatExpansionPanel } from '@angular/material/expansion';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { OrderStatus } from '@constant';
import { AnalyticsTogglePanel, FleetAnalyticsEventType, FleetOrderRecordDto, OrderRecordDto } from '@data-access';
import { TranslateModule } from '@ngx-translate/core';
import { CorePaths } from '@ui/core/models/core-paths';
import { AnalyticsService } from '@ui/core/services/analytics.service';
import { StorageService, userRoleKey } from '@ui/core/services/storage.service';
import { DriverPaths } from '@ui/modules/drivers/models/driver-paths';
import { TripsSplitPaymentsDetailsComponent } from '@ui/modules/orders/features/trips/components/trips-split-payments-details/trips-split-payments-details.component';
import { OrdersPaths } from '@ui/modules/orders/models/orders-paths';
import { VehiclePaths } from '@ui/modules/vehicles/models/vehicle-paths';
import {
  MAT_ACCORDION_IMPORTS,
  NormalizeStringPipe,
  ProgressSpinnerComponent,
  StatusBadgeComponent,
  UIService,
} from '@ui/shared';
import { MoneyComponent } from '@ui/shared/components/money/money.component';
import { OrderAdditionalIncomeInfoComponent } from '@ui/shared/components/order-additional-income-info/order-additional-income-info.component';
import { ProductTypeChipComponent } from '@ui/shared/components/product-type-chip/product-type-chip.component';
import { RoutePointsComponent } from '@ui/shared/components/route-points/route-points.component';
import { SplitPaymentsTooltipComponent } from '@ui/shared/components/split-payments-tooltip/split-payments-tooltip.component';
import { ORDER_STATUS_COLOR } from '@ui/shared/consts';
import { CurrencySymbolPipe } from '@ui/shared/pipes/currency-symbol/currency-symbol.pipe';
import { MoneyPipe } from '@ui/shared/pipes/money';
import { Seconds2DatePipe } from '@ui/shared/pipes/seconds-2-date/seconds-2-date.pipe';
import { Seconds2TimePipe } from '@ui/shared/pipes/seconds-2-time/seconds-2-time.pipe';
import { IconsConfig } from '@ui/shared/tokens/icons.config';
import { ICONS } from '@ui/shared/tokens/icons.token';
import { NgxTippyModule } from 'ngx-tippy-wrapper';
import { Observable } from 'rxjs';

@Component({
  selector: 'upf-trips-list',
  standalone: true,
  imports: [
    MAT_ACCORDION_IMPORTS,
    TranslateModule,
    NgClass,
    RouterLink,
    Seconds2DatePipe,
    Seconds2TimePipe,
    RoutePointsComponent,
    MoneyPipe,
    CurrencySymbolPipe,
    MatIcon,
    NgxTippyModule,
    MoneyComponent,
    SplitPaymentsTooltipComponent,
    TitleCasePipe,
    ProductTypeChipComponent,
    StatusBadgeComponent,
    NgTemplateOutlet,
    ProgressSpinnerComponent,
    MatDivider,
    NormalizeStringPipe,
    TripsSplitPaymentsDetailsComponent,
    OrderAdditionalIncomeInfoComponent,
    AsyncPipe,
  ],
  templateUrl: './trips-list.component.html',
  styleUrls: ['./trips-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TripsListComponent {
  @Input() public orders: FleetOrderRecordDto[];
  @Input() public isLoaded = true;

  @Output() public open = new EventEmitter<OrderRecordDto>();
  @Output() public navigatedToOrder = new EventEmitter<void>();

  public readonly corePath = CorePaths;
  public readonly vehiclePath = VehiclePaths;
  public readonly driverPath = DriverPaths;
  public readonly orderStatus = OrderStatus;
  public readonly orderDetailsPath = `/${CorePaths.WORKSPACE}/${CorePaths.ORDERS}/${OrdersPaths.DETAILS}`;
  public readonly statusColor = ORDER_STATUS_COLOR;

  public isMobileView$: Observable<boolean> = this.uiService.breakpointMatch();

  constructor(
    private readonly uiService: UIService,
    private readonly storage: StorageService,
    private readonly analytics: AnalyticsService,
    @Inject(ICONS) public icons: IconsConfig,
  ) {}

  public togglePanel(panel: MatExpansionPanel): void {
    panel.toggle();

    this.analytics.reportEvent<AnalyticsTogglePanel>(FleetAnalyticsEventType.FLEET_ORDER_REPORT_DETAILS, {
      user_access: this.storage.get(userRoleKey),
      view: panel.expanded ? 'opened' : 'closed',
    });
  }
}
