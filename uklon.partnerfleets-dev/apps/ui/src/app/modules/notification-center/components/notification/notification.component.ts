import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, HostBinding, Input, Output } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { NotificationItemDto } from '@data-access';
import { TranslateModule } from '@ngx-translate/core';
import { NotificationAvatarComponent } from '@ui/modules/notification-center/components';
import { CUSTOM_NOTIFICATION_STYLING, NOTIFICATION_BORDER } from '@ui/modules/notification-center/consts';
import { NotificationAuthorPipe } from '@ui/modules/notification-center/pipes/notification-author.pipe';
import { ReplaceNbspPipe } from '@ui/shared';
import { LetDirective } from '@ui/shared/directives/let.directive';
import { NgxTippyModule } from 'ngx-tippy-wrapper';

import { UklAngularCoreModule } from '@uklon/angular-core';

@Component({
  selector: 'upf-notification',
  standalone: true,
  imports: [
    DatePipe,
    NotificationAvatarComponent,
    TranslateModule,
    NgxTippyModule,
    UklAngularCoreModule,
    NotificationAuthorPipe,
    LetDirective,
    MatIcon,
    ReplaceNbspPipe,
  ],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationComponent {
  @HostBinding('class')
  public get customType(): string {
    return this.isCustom ? `${CUSTOM_NOTIFICATION_STYLING[this.notification.type]?.backgroundColor}` : 'tw-bg-white';
  }

  @Input() public notification: NotificationItemDto;
  @Input() public isMobileView: boolean;
  @Input() public isPinned = false;
  @Output() public readStateChange = new EventEmitter<NotificationItemDto>();
  @Output() public viewNotificationDetails = new EventEmitter<NotificationItemDto>();

  public readonly notificationBorder = NOTIFICATION_BORDER;
  public readonly customNotificationStyling = CUSTOM_NOTIFICATION_STYLING;

  public get isCustom(): boolean {
    return this.notification.is_bulk;
  }
}
