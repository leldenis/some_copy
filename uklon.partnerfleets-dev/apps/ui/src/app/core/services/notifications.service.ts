import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  CollectionCursorDto,
  GatewayNotificationType,
  NOTIFICATION_IMPORTANCE_MAP,
  NOTIFICATION_TYPE_MAP,
  NotificationDetailsDto,
  NotificationEventDto,
  NotificationItemDto,
  NotificationsUnreadCountDto,
  PaginationCollectionDto,
} from '@data-access';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, map, Observable, of, Subject, switchMap } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class NotificationsService {
  private readonly count$ = new BehaviorSubject<number>(0);
  private readonly open$ = new Subject<void>();
  private readonly close$ = new Subject<void>();
  private readonly newEvent$ = new Subject<NotificationItemDto>();
  private readonly customCount$ = new BehaviorSubject<number>(0);

  public readonly unreadCount$ = this.count$.asObservable();
  public readonly openSidenav$ = this.open$.asObservable();
  public readonly closeSidenav$ = this.close$.asObservable();
  public readonly newNotification$ = this.newEvent$.asObservable();
  public readonly unreadCustomCount$ = this.customCount$.asObservable();

  constructor(
    private readonly http: HttpClient,
    private readonly toastrService: ToastrService,
  ) {}

  public getFleetUnreadNotificationsCount(fleetId: string): Observable<NotificationsUnreadCountDto> {
    // Skip request for WebView
    if (!fleetId) return of({ unread_count: 0 });

    return this.http
      .get<NotificationsUnreadCountDto>(`api/notifications/fleet/${fleetId}/unread-count`)
      .pipe(tap(({ unread_count }) => this.count$.next(unread_count)));
  }

  public getMultipleFleetsUnreadNotificationsCount(fleetIds: string[]): Observable<Record<string, number>> {
    return this.http.post<Record<string, number>>('api/notifications/fleet/unread-count', { items: fleetIds });
  }

  public getFleetNotificationsHistory(
    fleetId: string,
    cursor: string,
    limit: number,
  ): Observable<CollectionCursorDto<NotificationItemDto>> {
    return this.http
      .get<CollectionCursorDto<NotificationItemDto>>(`api/notifications/fleet/${fleetId}`, {
        params: { cursor, limit },
      })
      .pipe(
        switchMap((notifications) => {
          // TODO: Refactor to use signals
          const count = notifications.previous_cursor?.startsWith('0')
            ? this.getFleetUnreadNotificationsCount(fleetId)
            : of({ unread_count: this.count$.getValue() });

          return count.pipe(map(() => notifications));
        }),
      );
  }

  public markSingleNotificationAsRead(
    fleetId: string,
    notificationId: string,
    isCustom: boolean = false,
  ): Observable<void> {
    return this.http.post<void>(`api/notifications/fleet/${fleetId}/read/${notificationId}`, {}).pipe(
      tap(() => {
        this.updateCount(-1);

        if (!isCustom) return;

        this.updateCustomCount(-1);
      }),
    );
  }

  public markMultipleNotificationsAsRead(fleetId: string, items: string[]): Observable<void> {
    return this.http.post<void>(`api/notifications/fleet/${fleetId}/read`, { items });
  }

  public markAllNotificationsAsRead(fleetId: string): Observable<void> {
    return this.http.post<void>(`api/notifications/fleet/${fleetId}/read/all`, {}).pipe(tap(() => this.resetCounts()));
  }

  public markSingleNotificationAsUnread(
    fleetId: string,
    notificationId: string,
    isCustom: boolean = false,
  ): Observable<void> {
    return this.http.post<void>(`api/notifications/fleet/${fleetId}/unread/${notificationId}`, {}).pipe(
      tap(() => {
        this.updateCount();

        if (!isCustom) return;

        this.updateCustomCount();
      }),
    );
  }

  public getTopUnreadCustomNotifications(
    fleetId: string,
    topCount: number = 3,
  ): Observable<PaginationCollectionDto<NotificationItemDto>> {
    return this.http
      .get<PaginationCollectionDto<NotificationItemDto>>(`api/notifications/fleet/${fleetId}/bulk/top-unread`, {
        params: { topCount },
      })
      .pipe(
        tap((collection) => {
          this.customCount$.next(collection.total_count);
          this.handleToasts(collection);
        }),
      );
  }

  public getNotificationDetails(fleetId: string, notificationId: string): Observable<NotificationDetailsDto> {
    return this.http.get<NotificationDetailsDto>(
      `api/notifications/fleet/${fleetId}/notifications/${notificationId}/details`,
    );
  }

  public acceptNotification(fleetId: string, notificationId: string): Observable<void> {
    return this.http.post<void>(`api/notifications/fleet/${fleetId}/notifications/${notificationId}/accept`, {});
  }

  public updateCount(count = 1): void {
    this.count$.next(Math.max(this.count$.getValue() + count, 0));
  }

  public updateCustomCount(count = 1): void {
    this.customCount$.next(Math.max(this.customCount$.getValue() + count, 0));
  }

  public handleNewEvent({ occurredAt, notification }: NotificationEventDto): void {
    const newNotification: NotificationItemDto = {
      id: notification.id,
      sent_at: Number(occurredAt),
      is_read: false,
      type: NOTIFICATION_TYPE_MAP[notification?.type],
      importance: NOTIFICATION_IMPORTANCE_MAP[notification?.importance],
      message: notification?.message,
      fleet_id: notification?.fleetId,
      is_bulk: notification?.isBulk,
      is_acceptance_required: notification.type === GatewayNotificationType.NOTIFICATION_TYPE_ACCEPTANCE_REQUIRED,
      accepted_at: null,
    } as NotificationItemDto;

    this.newEvent$.next(newNotification);
  }

  public openNotificationsSidenav(): void {
    this.open$.next();
  }

  public closeNotificationsSidenav(): void {
    this.close$.next();
  }

  private handleToasts({ total_count, items }: PaginationCollectionDto<NotificationItemDto>): void {
    this.toastrService.clear();

    if (!total_count) return;

    items.reverse().forEach((payload) => this.toastrService.show(payload.message, '', { payload }));
  }

  private resetCounts(): void {
    this.count$.next(0);
    this.customCount$.next(0);
  }
}
