import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { FleetOrderRecordRouteDto } from '@data-access';
import { RouteTooltipPipe } from '@ui/modules/orders/pipes/route-tooltip/route-tooltip.pipe';
import { ICONS } from '@ui/shared/tokens';
import { NgxTippyModule } from 'ngx-tippy-wrapper';

@Component({
  selector: 'upf-route-points',
  standalone: true,
  imports: [NgClass, MatIconModule, NgxTippyModule, RouteTooltipPipe],
  templateUrl: './route-points.component.html',
  styleUrls: ['./route-points.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [],
})
export class RoutePointsComponent {
  public readonly route = input<FleetOrderRecordRouteDto>();
  public readonly orderCanceled = input<boolean>();
  public readonly isRouteLink = input<boolean>(false);
  public readonly isMobile = input<boolean>(false);

  public navigate = output();

  public readonly icons = inject(ICONS);
}
