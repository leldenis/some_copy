import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { TicketStatus } from '@constant';
import { VehicleBrandingPeriodDto } from '@data-access';
import { TranslateModule } from '@ngx-translate/core';
import { PhotoControlDeadlineMessagePipe } from '@ui/modules/vehicles/pipes/photo-control-deadline-message/photo-control-deadline-message.pipe';
import { NgxTippyModule } from 'ngx-tippy-wrapper';

@Component({
  selector: 'upf-vehicle-branding-period-icon',
  standalone: true,
  imports: [MatIcon, PhotoControlDeadlineMessagePipe, TranslateModule, NgxTippyModule],
  templateUrl: './vehicle-branding-period-icon.component.html',
  styleUrl: './vehicle-branding-period-icon.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VehicleBrandingPeriodIconComponent {
  public brandingPeriod = input.required<VehicleBrandingPeriodDto>();
  public readonly ticketStatus = TicketStatus;
}
