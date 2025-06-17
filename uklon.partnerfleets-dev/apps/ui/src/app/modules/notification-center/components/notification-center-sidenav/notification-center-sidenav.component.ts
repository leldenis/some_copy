import { CommonModule, KeyValue } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, EventEmitter, OnInit, Output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import {
  AnalyticsNotifications,
  FleetAnalyticsEventType,
  NotificationDetailsDto,
  NotificationItemDto,
  NotificationTypeValue,
} from '@data-access';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AnalyticsService } from '@ui/core/services/analytics.service';
import { NotificationsService } from '@ui/core/services/notifications.service';
import { fleetIdKey, StorageService, userRoleKey } from '@ui/core/services/storage.service';
import { NotificationDetailsDialogComponent } from '@ui/modules/notification-center/components';
import { NotificationComponent } from '@ui/modules/notification-center/components/notification/notification.component';
import { NotificationDatePipe } from '@ui/modules/notification-center/pipes/notification-date.pipe';
import { CountMaskPipe, hasNextBatch, UIService } from '@ui/shared';
import { EmptyStateComponent } from '@ui/shared/components/empty-state/empty-state.component';
import { EmptyStates } from '@ui/shared/components/empty-state/empty-states';
import { LoadingIndicatorComponent } from '@ui/shared/components/loading-indicator/loading-indicator.component';
import { DEFAULT_LIMIT } from '@ui/shared/consts';
import { LetDirective } from '@ui/shared/directives/let.directive';
import moment from 'moment';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, delay, finalize, forkJoin, map, Observable, of, switchMap } from 'rxjs';
import { filter, tap } from 'rxjs/operators';

import { toClientDate } from '@uklon/angular-core';
import { ScrolledDirectiveModule } from '@uklon/fleets/angular/cdk';

const NOTIFICATION_DATE = (date: number): number => moment(toClientDate(date)).startOf('day').valueOf();

@Component({
  selector: 'upf-notification-center-sidenav',
  standalone: true,
  imports: [
    CommonModule,
    MatIcon,
    LetDirective,
    InfiniteScrollModule,
    ScrolledDirectiveModule,
    RouterModule,
    MatButton,
    TranslateModule,
    NotificationDatePipe,
    NotificationComponent,
    LoadingIndicatorComponent,
    CountMaskPipe,
    EmptyStateComponent,
  ],
  templateUrl: './notification-center-sidenav.component.html',
  styleUrl: './notification-center-sidenav.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationCenterSidenavComponent implements OnInit {
  @Output() public closeSidenav = new EventEmitter<void>();

  public isLoading: boolean;
  public hasNext: boolean;
  public cursor = '0';
  public limit = DEFAULT_LIMIT;
  public readonly emptyState = EmptyStates;
  public readonly analyticsEvent = FleetAnalyticsEventType;
  public readonly locale = this.translateService.currentLang;
  public readonly count$ = this.notificationsService.unreadCount$;
  public readonly hasCustomNotifications$ = this.notificationsService.unreadCustomCount$;
  public readonly notifications$ = new BehaviorSubject<Map<number, NotificationItemDto[]>>(new Map());
  public readonly pinnedNotifications$ = new BehaviorSubject<NotificationItemDto[]>([]);
  public readonly isMobileView$ = this.uiService.breakpointMatch();

  private readonly fleetId = this.storage.get(fleetIdKey) ?? '';

  constructor(
    private readonly notificationsService: NotificationsService,
    private readonly storage: StorageService,
    private readonly translateService: TranslateService,
    private readonly router: Router,
    private readonly uiService: UIService,
    private readonly analytics: AnalyticsService,
    private readonly destroyRef: DestroyRef,
    private readonly toastrService: ToastrService,
    private readonly dialog: MatDialog,
  ) {}

  public readonly preserveOrder = (
    a: KeyValue<number, NotificationItemDto[]>,
    b: KeyValue<number, NotificationItemDto[]>,
  ): number => {
    return b.key - a.key;
  };

  public ngOnInit(): void {
    this.toastrService.clear();
    this.getNotifications();
    this.handleNewNotifications();
  }

  public onLoadNext(): void {
    if (!this.hasNext || this.isLoading) return;

    this.getNotifications(true);
  }

  public onNotificationClick(
    event: MouseEvent,
    notification: NotificationItemDto,
    date: number,
    index: number,
    unread: number,
  ): void {
    const element = event.target as HTMLElement;

    if (element.tagName !== 'A') return;

    const href = element.getAttribute('href').split('/').slice(1).join('/');
    this.router.navigateByUrl(href).then(() => this.closeSidenav.emit());
    event.preventDefault();

    if (notification.is_read) return;

    this.toggleNotificationReadState(
      date,
      notification,
      index,
      unread,
      FleetAnalyticsEventType.NOTIFICATIONS_LINK_CLICK,
    );
  }

  public toggleNotificationReadState(
    date: number,
    notification: NotificationItemDto,
    index: number,
    unread: number,
    eventType?: FleetAnalyticsEventType,
  ): void {
    const request = notification.is_read
      ? this.notificationsService.markSingleNotificationAsUnread(this.fleetId, notification.id, notification.is_bulk)
      : this.notificationsService.markSingleNotificationAsRead(this.fleetId, notification.id, notification.is_bulk);

    const notifications = this.updateNotificationReadStatus(date, index, notification);
    request.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => this.notifications$.next(notifications));

    this.analytics.reportEvent<AnalyticsNotifications>(
      eventType || FleetAnalyticsEventType.NOTIFICATIONS_READ_MARKER_CLICK,
      {
        unread,
        notification_type: notification.type,
        notification_state: notification.is_read ? 'read' : 'unread',
      },
    );
  }

  public markAllNotificationsAsRead(unread: number): void {
    if (!unread) return;

    const notificationMap = this.notifications$.getValue();
    const readNotificationsMap = new Map();

    notificationMap.forEach((notifications, key) => {
      const updatedNotifications = notifications.map((item) => ({ ...item, is_read: true }));
      readNotificationsMap.set(key, updatedNotifications);
    });

    this.notificationsService
      .markAllNotificationsAsRead(this.fleetId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.notifications$.next(readNotificationsMap));

    this.analytics.reportEvent<AnalyticsNotifications>(FleetAnalyticsEventType.NOTIFICATIONS_SIDENAV_READ_ALL, {
      unread,
    });
  }

  public onViewNotificationDetails(notification: NotificationItemDto, date: number = 0, index: number = 0): void {
    this.notificationsService
      .getNotificationDetails(this.fleetId, notification.id)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        switchMap((details) => this.openDetailsDialog(details, notification)),
        tap(() => {
          if (date && !notification.is_read) {
            this.notifications$.next(this.updateNotificationReadStatus(date, index, notification));
          }

          if (notification.type !== NotificationTypeValue.ACCEPTANCE_REQUIRED) return;

          this.handlePinnedNotificationStatusChange(notification);
        }),
      )
      .subscribe();
  }

  public onCloseSidenav(eventType: FleetAnalyticsEventType, unread: number): void {
    this.closeSidenav.emit();
    this.analytics.reportEvent<AnalyticsNotifications>(eventType, { unread });
  }

  private getNotifications(loadNext: boolean = false): void {
    this.isLoading = true;

    this.notificationsService
      .getFleetNotificationsHistory(this.fleetId, this.cursor, this.limit)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        delay(300),
        finalize(() => {
          this.isLoading = false;
        }),
        tap(({ items, next_cursor }) => {
          this.isLoading = false;
          this.cursor = next_cursor;
          this.limit = DEFAULT_LIMIT;
          this.hasNext = hasNextBatch(next_cursor);
          this.notifications$.next(this.groupNotifications(items, loadNext));
        }),
      )
      .subscribe();
  }

  private groupNotifications(items: NotificationItemDto[], concat: boolean): Map<number, NotificationItemDto[]> {
    const grouped = concat ? this.notifications$.getValue() : new Map<number, NotificationItemDto[]>();

    items.forEach((item) => {
      if (this.addNotificationToPinned(item)) return;

      const date = NOTIFICATION_DATE(item.sent_at);
      const group = grouped.has(date) ? [...grouped.get(date), item] : [item];
      group.sort((a, b) => b.sent_at - a.sent_at);
      grouped.set(date, group);
    });

    return grouped;
  }

  private handleNewNotifications(): void {
    this.notificationsService.newNotification$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((notification) => {
      if (this.addNotificationToPinned(notification)) return;
      this.groupNotifications([notification], true);
    });
  }

  private addNotificationToPinned(notification: NotificationItemDto): boolean {
    if (!notification.is_acceptance_required || notification.accepted_at) return false;
    const notifications = [notification, ...this.pinnedNotifications$.getValue()].sort((a, b) => b.sent_at - a.sent_at);

    this.pinnedNotifications$.next(notifications);

    return true;
  }

  private openDetailsDialog(data: NotificationDetailsDto, { is_read }: NotificationItemDto): Observable<null> {
    return this.dialog
      .open(NotificationDetailsDialogComponent, { data })
      .afterClosed()
      .pipe(
        tap((res) => this.reportDialogClosed(data, Boolean(res))),
        filter(Boolean),
        switchMap(({ type, accepted_at, id }) => {
          const accept$ =
            type === NotificationTypeValue.ACCEPTANCE_REQUIRED && !accepted_at
              ? this.notificationsService.acceptNotification(this.fleetId, id)
              : of(null);

          const read$ = is_read
            ? of(null)
            : this.notificationsService.markSingleNotificationAsRead(this.fleetId, id, true);

          return forkJoin([accept$, read$]);
        }),
        map(() => null),
      );
  }

  private handlePinnedNotificationStatusChange(notification: NotificationItemDto): void {
    const pinned = [...this.pinnedNotifications$.getValue()];
    const pinnedIndex = pinned.findIndex(({ id }) => id === notification.id);
    const date = NOTIFICATION_DATE(notification.sent_at);

    if (pinnedIndex < 0) return;

    pinned.splice(pinnedIndex, 1);
    this.pinnedNotifications$.next(pinned);

    if (this.notifications$.getValue().has(date)) {
      const grouped = this.groupNotifications([{ ...notification, accepted_at: Date.now(), is_read: true }], true);
      this.notifications$.next(grouped);
      return;
    }

    this.limit = 1;
    this.getNotifications(true);
  }

  private updateNotificationReadStatus(
    date: number,
    index: number,
    notification: NotificationItemDto,
  ): Map<number, NotificationItemDto[]> {
    const notifications = new Map(this.notifications$.getValue());
    const group = [...notifications.get(date)];
    group.splice(index, 1, { ...notification, is_read: !notification.is_read });
    notifications.set(date, group);

    return notifications;
  }

  private reportDialogClosed({ type, id, image_base_64 }: NotificationDetailsDto, accepted: boolean): void {
    this.analytics.reportEvent(FleetAnalyticsEventType.NOTIFICATION_DESCRIPTION_POPUP_CLOSE, {
      notification_type: type,
      notification_id: id,
      image_present: Boolean(image_base_64),
      user_access: this.storage.get(userRoleKey),
      fleet_id: this.storage.get(fleetIdKey),
      page: 'notification_details_popup',
      accepted,
    });
  }
}
