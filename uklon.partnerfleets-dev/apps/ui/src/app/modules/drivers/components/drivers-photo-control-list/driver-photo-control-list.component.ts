import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatDivider } from '@angular/material/divider';
import { MatAccordion, MatExpansionPanel, MatExpansionPanelHeader } from '@angular/material/expansion';
import { MatIcon } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';
import { BlockedListStatusValue, TicketStatus } from '@constant';
import { DriverPhotoControlTicketItemDto } from '@data-access';
import { TranslateModule } from '@ngx-translate/core';
import { CorePaths } from '@ui/core/models/core-paths';
import { DriverPaths } from '@ui/modules/drivers/models/driver-paths';
import { PhotoControlDeadlineMessagePipe } from '@ui/modules/vehicles/pipes/photo-control-deadline-message/photo-control-deadline-message.pipe';
import { StatusBadgeComponent } from '@ui/shared';
import { PHOTO_CONTROL_TICKET_STATUS_COLOR } from '@ui/shared/consts';
import { LetDirective } from '@ui/shared/directives/let.directive';
import { NgxTippyModule } from 'ngx-tippy-wrapper';

@Component({
  selector: 'upf-driver-photo-control-list',
  standalone: true,
  imports: [
    CommonModule,
    MatAccordion,
    TranslateModule,
    MatExpansionPanel,
    MatExpansionPanelHeader,
    MatIcon,
    RouterLink,
    NgxTippyModule,
    LetDirective,
    PhotoControlDeadlineMessagePipe,
    StatusBadgeComponent,
    MatDivider,
  ],
  templateUrl: './driver-photo-control-list.component.html',
  styleUrl: './driver-photo-control-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DriverPhotoControlListComponent {
  public tickets = input.required<DriverPhotoControlTicketItemDto[]>();
  public isMobileView = input.required<boolean>();
  public goToPhotoControl = output<string>();

  public readonly corePaths = CorePaths;
  public readonly driverPaths = DriverPaths;
  public readonly driverBlockedStatus = BlockedListStatusValue.BLOCKED;
  public readonly statusColor = PHOTO_CONTROL_TICKET_STATUS_COLOR;
  public readonly ticketStatus = TicketStatus;

  constructor(private readonly router: Router) {}

  public navigateToPhotoControl(ticketId: string): void {
    this.router.navigate(['/', CorePaths.WORKSPACE, CorePaths.DRIVERS, DriverPaths.PHOTO_CONTROL, ticketId]);
    this.goToPhotoControl.emit(ticketId);
  }
}
