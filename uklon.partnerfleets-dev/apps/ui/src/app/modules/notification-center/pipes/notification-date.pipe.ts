import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import moment from 'moment';

const TODAY = moment(new Date()).startOf('day').valueOf();
const YESTERDAY = moment(new Date()).startOf('day').subtract(1, 'day').valueOf();

@Pipe({
  name: 'notificationDate',
  standalone: true,
})
export class NotificationDatePipe implements PipeTransform {
  constructor(private readonly translateService: TranslateService) {}

  public transform(time: number, locale: string): string {
    if (time === TODAY || time === YESTERDAY) {
      return this.translateService.instant(`NotificationCenter.${time === TODAY ? 'Today' : 'Yesterday'}`);
    }

    return moment(time).locale(locale).format('DD MMMM YYYY');
  }
}
