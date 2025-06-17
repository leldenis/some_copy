import { ChangeDetectionStrategy, Component, inject, Input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { TicketActivityLogItemDto } from '@data-access';
import { TranslateModule } from '@ngx-translate/core';
import { InfoPanelComponent } from '@ui/shared/modules/info-panel/components/info-panel/info-panel.component';
import { InfoPanelIconDirective, InfoPanelTitleDirective } from '@ui/shared/modules/info-panel/directives';
import { ICONS } from '@ui/shared/tokens/icons.token';

@Component({
  selector: 'upf-ticket-status-reasons',
  templateUrl: './ticket-status-reasons.component.html',
  styleUrls: ['./ticket-status-reasons.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIcon, TranslateModule, InfoPanelComponent, InfoPanelIconDirective, InfoPanelTitleDirective],
})
export class TicketStatusReasonsComponent {
  @Input() public activeLogs: TicketActivityLogItemDto[];
  @Input() public reasonPath = 'Vehicles.Creation.VehicleTicketActiveLogs.';
  @Input() public showTitle = true;

  public readonly icons = inject(ICONS);
}
