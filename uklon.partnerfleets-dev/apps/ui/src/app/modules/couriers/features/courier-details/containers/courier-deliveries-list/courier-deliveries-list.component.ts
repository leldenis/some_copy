import { SelectionModel } from '@angular/cdk/collections';
import { NgClass, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatDivider } from '@angular/material/divider';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { OrderStatus, PaymentType } from '@constant';
import { CourierDeliveryItemDto } from '@data-access';
import { TranslateModule } from '@ngx-translate/core';
import { CorePaths } from '@ui/core/models/core-paths';
import { OrdersPaths } from '@ui/modules/orders/models/orders-paths';
import { MAT_TABLE_IMPORTS, StatusBadgeComponent } from '@ui/shared';
import { ORDER_STATUS_COLOR } from '@ui/shared/consts';
import { LetDirective } from '@ui/shared/directives/let.directive';
import { MoneyPipe } from '@ui/shared/pipes/money';
import { Seconds2DatePipe } from '@ui/shared/pipes/seconds-2-date/seconds-2-date.pipe';
import { Seconds2TimePipe } from '@ui/shared/pipes/seconds-2-time/seconds-2-time.pipe';
import { NgxTippyModule } from 'ngx-tippy-wrapper';

@Component({
  selector: 'upf-courier-deliveries-list',
  standalone: true,
  imports: [
    MAT_TABLE_IMPORTS,
    NgTemplateOutlet,
    Seconds2DatePipe,
    Seconds2TimePipe,
    MoneyPipe,
    TranslateModule,
    MatIcon,
    StatusBadgeComponent,
    LetDirective,
    NgxTippyModule,
    MatIconButton,
    MatDivider,
    NgClass,
    RouterLink,
  ],
  templateUrl: './courier-deliveries-list.component.html',
  styleUrls: ['./courier-deliveries-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CourierDeliveriesListComponent {
  @Input() public items: CourierDeliveryItemDto[] = [];

  public readonly rowHeaderColumns = ['PickupTime', 'Route', 'CostAndDistance', 'PaymentType', 'Status'];
  public readonly rowColumns = [...this.rowHeaderColumns, 'Toggle', 'ExpandedView'];
  public readonly corePath = CorePaths;
  public readonly orderPath = OrdersPaths;

  public readonly orderStatus = OrderStatus;
  public readonly statusColor = ORDER_STATUS_COLOR;

  public readonly paymentTypeIcons = new Map<PaymentType, string>([
    [PaymentType.CASH, 'cash'],
    [PaymentType.TERMINAL, 'wallet'],
    [PaymentType.CORPORATE_WALLET, 'wallet'],
    [PaymentType.UWALLET, 'wallet'],
    [PaymentType.CARD, 'card'],
    [PaymentType.GOOGLE, 'card'],
    [PaymentType.APPLE, 'card'],
  ]);

  public readonly selection = new SelectionModel<number>();

  public toggle(index: number): void {
    this.selection.toggle(index);
  }
}
