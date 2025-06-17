import { Pipe, PipeTransform } from '@angular/core';
import { NotificationTypeValue } from '@data-access';
import { TranslateService } from '@ngx-translate/core';

@Pipe({
  name: 'notificationAuthor',
  standalone: true,
})
export class NotificationAuthorPipe implements PipeTransform {
  constructor(private readonly translateService: TranslateService) {}

  public transform(type: NotificationTypeValue): string {
    switch (type) {
      case NotificationTypeValue.B2B_SPLIT_ADJUSTMENT_CHANGED:
      case NotificationTypeValue.B2B_SPLIT_DISTRIBUTION_CHANGED:
      case NotificationTypeValue.B2B_SPLIT_ADJUSTMENT_CANCELED:
        return this.translateService.instant('DriverHistory.Roles.UklonManager');
      default:
        return '';
    }
  }
}
