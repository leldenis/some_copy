import { TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { ActiveOrderItemDto, AnalyticsMapOrderStatus, FleetAnalyticsEventType } from '@data-access';
import { TranslateModule } from '@ngx-translate/core';
import { AnalyticsService } from '@ui/core/services/analytics.service';
import { MoneyPipe } from '@ui/shared/pipes/money';

@Component({
  selector: 'upf-map-route-details',
  standalone: true,
  imports: [TranslateModule, TitleCasePipe, MoneyPipe, MatIcon],
  templateUrl: './map-route-details.component.html',
  styleUrls: ['./map-route-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapRouteDetailsComponent {
  @Input() public order: ActiveOrderItemDto;

  @Input() public isDelivery = false;

  @Output() public navigateToOrder = new EventEmitter<void>();

  constructor(private readonly analytics: AnalyticsService) {}

  public reportEvent(): void {
    this.analytics.reportEvent<AnalyticsMapOrderStatus>(FleetAnalyticsEventType.LIVE_MAP_TOGGLE_ACTIVE_ORDER, {
      ride_status: this.order?.status,
    });
  }
}
