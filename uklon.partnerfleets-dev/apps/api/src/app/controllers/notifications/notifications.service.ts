import { HttpControllerService } from '@api/common/http/http-controller.service';
import { PartnersService } from '@api/datasource';
import {
  CollectionDto,
  CollectionCursorDto,
  NotificationDetailsDto,
  NotificationItemDto,
  NotificationsUnreadCountDto,
  PaginationCollectionDto,
} from '@data-access';
import { Injectable } from '@nestjs/common';
import { forkJoin, map, Observable } from 'rxjs';

import { Jwt } from '@uklon/nest-core';

@Injectable()
export class NotificationsService extends HttpControllerService {
  constructor(private readonly partnersService: PartnersService) {
    super();
  }

  public getFleetNotificationsUnreadCount(fleetId: string, token: Jwt): Observable<NotificationsUnreadCountDto> {
    return this.partnersService.get<NotificationsUnreadCountDto>(
      `api/v1/fleets/${fleetId}/notifications/unread-count`,
      {
        token,
      },
    );
  }

  public getMultipleFleetsNotificationsUnreadCount(
    body: CollectionDto<string>,
    token: Jwt,
  ): Observable<Record<string, number>> {
    const requests = body.items.map((id) =>
      this.getFleetNotificationsUnreadCount(id, token).pipe(map((res) => ({ ...res, id }))),
    );

    return forkJoin(requests).pipe(
      map((res) => {
        return Object.fromEntries(res.map(({ unread_count, id }) => [id, unread_count]));
      }),
    );
  }

  public getFleetNotificationsHistory(
    fleetId: string,
    cursor: string,
    limit: number,
    token: Jwt,
  ): Observable<CollectionCursorDto<NotificationItemDto>> {
    return this.partnersService.get<CollectionCursorDto<NotificationItemDto>>(
      `api/v1/fleets/${fleetId}/notifications`,
      {
        token,
        params: {
          cursor,
          limit,
        },
      },
    );
  }

  public markSingleNotificationAsRead(fleetId: string, notificationId: string, token: Jwt): Observable<void> {
    return this.partnersService.post(`api/v1/fleets/${fleetId}/notifications/${notificationId}/:read`, {}, { token });
  }

  public markMultipleNotificationAsRead(fleetId: string, body: CollectionDto<string>, token: Jwt): Observable<void> {
    return this.partnersService.post(`api/v1/fleets/${fleetId}/notifications/:read`, body, { token });
  }

  public markAllNotificationAsRead(fleetId: string, token: Jwt): Observable<void> {
    return this.partnersService.post(`api/v1/fleets/${fleetId}/notifications/all/:read`, {}, { token });
  }

  public markSingleNotificationAsUnread(fleetId: string, notificationId: string, token: Jwt): Observable<void> {
    return this.partnersService.post(`api/v1/fleets/${fleetId}/notifications/${notificationId}/:unread`, {}, { token });
  }

  public getTopUnreadCustomNotifications(
    fleetId: string,
    top_count: number,
    token: Jwt,
  ): Observable<PaginationCollectionDto<NotificationItemDto>> {
    return this.partnersService.get(`api/v1/fleets/${fleetId}/notifications/bulk/top-unread`, {
      token,
      params: { top_count },
    });
  }

  public getNotificationDetails(
    fleetId: string,
    notificationId: string,
    token: Jwt,
  ): Observable<NotificationDetailsDto> {
    return this.partnersService.get(`api/v1/fleets/${fleetId}/notifications/${notificationId}`, { token });
  }

  public acceptNotification(fleetId: string, notificationId: string, token: Jwt): Observable<void> {
    return this.partnersService.post(`api/v1/fleets/${fleetId}/notifications/${notificationId}/:accept`, {}, { token });
  }
}
