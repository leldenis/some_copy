import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, HostBinding, Input, OnInit } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { TicketStatus } from '@constant';
import { EmployeeLocationStatus, VehicleDetailsPhotoControlDto } from '@data-access';
import { TranslateModule } from '@ngx-translate/core';
import { PhotoControlDeadlineMessagePipe } from '@ui/modules/vehicles/pipes/photo-control-deadline-message/photo-control-deadline-message.pipe';
import moment from 'moment';
import { NgxTippyModule } from 'ngx-tippy-wrapper';

import { toClientDate } from '@uklon/angular-core';

@Component({
  selector: 'upf-map-photo-control-icon',
  standalone: true,
  imports: [MatIcon, NgClass, NgxTippyModule, TranslateModule, PhotoControlDeadlineMessagePipe],
  templateUrl: './map-photo-control-icon.component.html',
  styleUrls: ['./map-photo-control-icon.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapPhotoControlIconComponent implements OnInit {
  @Input() public photoControl: VehicleDetailsPhotoControlDto;

  @Input() public employeeStatus: EmployeeLocationStatus;

  @HostBinding('class.!tw-hidden')
  public get showIcon(): boolean {
    return (
      (this.hideIconStatus.has(this.photoControl?.status) && !this.photoControl?.block_immediately) ||
      this.employeeStatus === EmployeeLocationStatus.Blocked
    );
  }

  public tooltipTitle = '';

  private readonly hideIconStatus = new Set<TicketStatus>([
    TicketStatus.SENT,
    TicketStatus.REVIEW,
    TicketStatus.APPROVED,
  ]);

  public ngOnInit(): void {
    this.setTooltipTitle();
  }

  private setTooltipTitle(): void {
    const { deadline_to_send, block_immediately, status } = this.photoControl;
    const diff = moment(toClientDate(deadline_to_send)).diff(moment(new Date()), 'days');
    const passedDeadline = diff < 0;

    if (block_immediately) {
      this.tooltipTitle = 'PhotoControl.Tooltips.LiveMap.BlockImmediately';
      return;
    }

    switch (status) {
      case TicketStatus.CLARIFICATION:
        this.tooltipTitle = passedDeadline
          ? 'PhotoControl.Tooltips.LiveMap.ClarificationAfterDeadline'
          : 'PhotoControl.Tooltips.LiveMap.ClarificationBeforeDeadline';
        break;
      case TicketStatus.DRAFT:
        this.tooltipTitle = passedDeadline
          ? 'PhotoControl.Tooltips.LiveMap.DraftAfterDeadline'
          : 'PhotoControl.Tooltips.LiveMap.DraftBeforeDeadline';
        break;
      case TicketStatus.REJECTED:
        this.tooltipTitle = 'PhotoControl.Tooltips.LiveMap.Rejected';
        break;
      default:
        this.tooltipTitle = '';
        break;
    }
  }
}
