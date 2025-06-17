import { ChangeDetectionStrategy, Component, HostBinding, Input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { NotificationType } from '@data-access';

import { CustomNotificationStyling, NOTIFICATION_TYPE_ICON } from '../../consts';

@Component({
  selector: 'upf-notification-avatar',
  standalone: true,
  imports: [MatIcon],
  templateUrl: './notification-avatar.component.html',
  styleUrl: './notification-avatar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationAvatarComponent {
  @HostBinding('class')
  public get avatarColor(): string {
    return this.styling?.mainColor ?? 'tw-bg-neutral-silver';
  }

  @Input() public notificationType: NotificationType;
  @Input() public styling: CustomNotificationStyling | undefined;

  public get icon(): string {
    return NOTIFICATION_TYPE_ICON(this.notificationType);
  }
}
