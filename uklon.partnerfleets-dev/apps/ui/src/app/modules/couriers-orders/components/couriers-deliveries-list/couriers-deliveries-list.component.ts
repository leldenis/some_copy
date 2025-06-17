import { NgClass, NgTemplateOutlet, TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatDivider } from '@angular/material/divider';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { OrderStatus } from '@constant';
import { CourierDeliveryDto } from '@data-access';
import { TranslateModule } from '@ngx-translate/core';
import { OrdersPaths } from '@ui/modules/orders/models/orders-paths';
import { MAT_ACCORDION_IMPORTS, StatusBadgeComponent } from '@ui/shared';
import { RoutePointsComponent } from '@ui/shared/components/route-points/route-points.component';
import { ORDER_STATUS_COLOR } from '@ui/shared/consts';
import { CurrencySymbolPipe } from '@ui/shared/pipes/currency-symbol/currency-symbol.pipe';
import { MoneyPipe } from '@ui/shared/pipes/money';
import { Seconds2DatePipe } from '@ui/shared/pipes/seconds-2-date/seconds-2-date.pipe';
import { Seconds2TimePipe } from '@ui/shared/pipes/seconds-2-time/seconds-2-time.pipe';
import { NgxTippyModule } from 'ngx-tippy-wrapper';

@Component({
  selector: 'upf-couriers-deliveries-list',
  standalone: true,
  imports: [
    MAT_ACCORDION_IMPORTS,
    TranslateModule,
    NgClass,
    NgTemplateOutlet,
    Seconds2DatePipe,
    Seconds2TimePipe,
    RouterLink,
    RoutePointsComponent,
    MoneyPipe,
    CurrencySymbolPipe,
    TitleCasePipe,
    MatIcon,
    NgxTippyModule,
    StatusBadgeComponent,
    MatDivider,
  ],
  templateUrl: './couriers-deliveries-list.component.html',
  styleUrls: ['./couriers-deliveries-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CouriersDeliveriesListComponent {
  public deliveries = input.required<CourierDeliveryDto[]>();
  public isMobileView = input.required<boolean>();

  public readonly orderPath = OrdersPaths;
  public readonly orderStatus = OrderStatus;
  public readonly statusColor = ORDER_STATUS_COLOR;
}
