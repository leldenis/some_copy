import { Pipe, PipeTransform } from '@angular/core';
import { TicketStatus } from '@constant';
import { PanelStyling, PHOTO_CONTROL_STATUS_STYLING } from '@ui/modules/vehicles/consts';
import moment from 'moment/moment';

import { toClientDate } from '@uklon/angular-core';

@Pipe({
  name: 'panelStyling',
  standalone: true,
})
export class PanelStylingPipe implements PipeTransform {
  public transform(status: TicketStatus, deadlineToSend?: number): PanelStyling {
    if (!status) {
      return PHOTO_CONTROL_STATUS_STYLING[TicketStatus.DRAFT];
    }

    if (
      [TicketStatus.REJECTED, TicketStatus.SENT, TicketStatus.REVIEW, TicketStatus.BLOCKED_BY_MANAGER].includes(status)
    ) {
      return PHOTO_CONTROL_STATUS_STYLING[status];
    }

    const daysDiff = moment(toClientDate(deadlineToSend)).diff(moment(), 'days');
    return PHOTO_CONTROL_STATUS_STYLING[daysDiff >= 0 ? TicketStatus.DRAFT : TicketStatus.REJECTED];
  }
}
