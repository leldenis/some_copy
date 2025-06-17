import { Injectable, Pipe, PipeTransform } from '@angular/core';
import moment from 'moment';

import { toClientDate } from '@uklon/angular-core';

@Pipe({
  name: 'photoControlDeadlineMessage',
  standalone: true,
})
@Injectable({ providedIn: 'root' })
export class PhotoControlDeadlineMessagePipe implements PipeTransform {
  public transform(deadline: number): {
    longTitle: string;
    shortTitle: string;
    till: string;
    days: number;
    passedDeadline: boolean;
  } {
    const deadlineMoment = moment(toClientDate(deadline));
    const now = moment();

    const diffInMilliseconds = deadlineMoment.diff(now);
    const diffInDays = Math.ceil(diffInMilliseconds / (1000 * 60 * 60 * 24));

    const passedDeadline = diffInMilliseconds < 0;
    const days = passedDeadline ? Math.abs(diffInDays) : diffInDays;

    return {
      longTitle: passedDeadline ? 'PhotoControl.Panel.DeadlinePassed' : 'PhotoControl.Panel.TillDeadline',
      shortTitle: passedDeadline ? 'PhotoControl.Panel.DeadlinePassed' : 'PhotoControl.Panel.TillDeadlineShort',
      till: deadlineMoment.format('DD.MM.YYYY'),
      days,
      passedDeadline,
    };
  }
}
