import { ChangeDetectionStrategy, Component, DestroyRef, HostBinding, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import {
  FleetAnalyticsEventType,
  NotificationDetailsDto,
  NotificationItemDto,
  NotificationType,
  NotificationTypeValue,
} from '@data-access';
import { AnalyticsService } from '@ui/core/services/analytics.service';
import { NotificationsService } from '@ui/core/services/notifications.service';
import { fleetIdKey, StorageService, userRoleKey } from '@ui/core/services/storage.service';
import { NotificationDetailsDialogComponent } from '@ui/modules/notification-center/components';
import { Toast } from 'ngx-toastr';
import { Observable, of, switchMap } from 'rxjs';
import { filter, tap } from 'rxjs/operators';

type PayloadType =
  | NotificationTypeValue.FLEET_CABINET_UPDATE
  | NotificationTypeValue.IMPORTANT_INFORMATION
  | NotificationTypeValue.ACCEPTANCE_REQUIRED;

const TYPE_TO_ICON: Record<PayloadType, string> = {
  [NotificationTypeValue.FLEET_CABINET_UPDATE]: 'info',
  [NotificationTypeValue.IMPORTANT_INFORMATION]: 'error',
  [NotificationTypeValue.ACCEPTANCE_REQUIRED]: 'warning',
} as const;

@Component({
  selector: 'upf-custom-toast',
  standalone: true,
  imports: [MatIcon],
  templateUrl: './custom-toast.component.html',
  styleUrl: './custom-toast.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: false,
})
export class CustomToastComponent extends Toast<NotificationItemDto> {
  @HostBinding('class')
  public get customToastClass(): NotificationType {
    return this.options.payload.type;
  }

  @HostBinding('attr.data-cy')
  public readonly attribute = 'notification-toast';

  private readonly notificationService = inject(NotificationsService);
  private readonly storageService = inject(StorageService);
  private readonly dialog = inject(MatDialog);
  private readonly destroyRef = inject(DestroyRef);
  private readonly analytics = inject(AnalyticsService);

  public get notification(): NotificationItemDto {
    return this.options.payload;
  }

  public get toastIcon(): string {
    return TYPE_TO_ICON[this.notification.type as PayloadType];
  }

  private get fleetId(): string {
    return this.storageService.get(fleetIdKey) ?? '';
  }

  public onClose(): void {
    this.remove();

    if (!this.fleetId) return;

    this.notificationService
      .markSingleNotificationAsRead(this.fleetId, this.notification.id, true)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }

  public override tapToast(): void {
    super.tapToast();

    if (!this.fleetId) return;

    this.notificationService
      .getNotificationDetails(this.fleetId, this.notification.id)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        switchMap((details) => this.openDetailsDialog(details)),
      )
      .subscribe(() => this.onClose());
  }

  private openDetailsDialog(data: NotificationDetailsDto): Observable<void> {
    return this.dialog
      .open(NotificationDetailsDialogComponent, { data })
      .afterClosed()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap((res) => this.reportDialogClosed(data, Boolean(res))),
        filter(Boolean),
        switchMap(({ type, accepted_at, id }) => {
          return type === NotificationTypeValue.ACCEPTANCE_REQUIRED && !accepted_at
            ? this.notificationService.acceptNotification(this.fleetId, id)
            : of(null);
        }),
      );
  }

  private reportDialogClosed({ type, id, image_base_64 }: NotificationDetailsDto, accepted: boolean): void {
    this.analytics.reportEvent(FleetAnalyticsEventType.NOTIFICATION_DESCRIPTION_POPUP_CLOSE, {
      notification_type: type,
      notification_id: id,
      image_present: Boolean(image_base_64),
      user_access: this.storageService.get(userRoleKey),
      fleet_id: this.storageService.get(fleetIdKey),
      page: 'notification_details_popup',
      accepted,
    });
  }
}
