import { PaginationCollectionOkResponse } from '@api/common';
import { CursorCollectionOkResponse } from '@api/common/decorators/cursor-collection-ok-response.decorator';
import { ApiErrorResponseEntity } from '@api/common/entities';
import { buildApiOperationOptions } from '@api/common/utils/swagger/build-api-operation-options';
import {
  NotificationDetailsEntity,
  NotificationItemEntity,
  NotificationsIdsCollectionEntity,
  NotificationsUnreadCountEntity,
} from '@api/controllers/notifications/entities';
import {
  CollectionDto,
  CollectionCursorDto,
  NotificationDetailsDto,
  NotificationItemDto,
  NotificationsUnreadCountDto,
  PaginationCollectionDto,
} from '@data-access';
import { Body, Controller, Get, HttpStatus, Param, Post, Query } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Observable } from 'rxjs';

import { Jwt, UserToken } from '@uklon/nest-core';

import { NotificationsService } from './notifications.service';

@ApiTags('Notifications')
@Controller('/notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get('fleet/:fleetId/unread-count')
  @ApiOperation(
    buildApiOperationOptions([{ service: 'P', method: 'GET', url: 'api/v1/fleets/{id}/notifications/unread-count' }]),
  )
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: NotificationsUnreadCountEntity })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request', type: ApiErrorResponseEntity })
  public getFleetNotificationsUnreadCount(
    @Param('fleetId') fleetId: string,
    @UserToken() token: Jwt,
  ): Observable<NotificationsUnreadCountDto> {
    return this.notificationsService.getFleetNotificationsUnreadCount(fleetId, token);
  }

  @Post('fleet/unread-count')
  @ApiOperation(
    buildApiOperationOptions([{ service: 'P', method: 'GET', url: 'api/v1/fleets/{id}/notifications/unread-count' }]),
  )
  @ApiBody({ type: NotificationsIdsCollectionEntity })
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: Map<string, number> })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request', type: ApiErrorResponseEntity })
  public getMultipleFleetsNotificationsUnreadCount(
    @UserToken() token: Jwt,
    @Body() body: { items: string[] },
  ): Observable<Record<string, number>> {
    return this.notificationsService.getMultipleFleetsNotificationsUnreadCount(body, token);
  }

  @Get('fleet/:fleetId')
  @ApiOperation(
    buildApiOperationOptions([
      { service: 'P', method: 'GET', url: 'api/v1/fleets/{id}/notifications?cursor=X&limit=Y' },
    ]),
  )
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request', type: ApiErrorResponseEntity })
  @CursorCollectionOkResponse(NotificationItemEntity)
  public getFleetNotificationsHistory(
    @Param('fleetId') fleetId: string,
    @Query('cursor') cursor: string,
    @Query('limit') limit: number,
    @UserToken() token: Jwt,
  ): Observable<CollectionCursorDto<NotificationItemDto>> {
    return this.notificationsService.getFleetNotificationsHistory(fleetId, cursor, limit, token);
  }

  @Post('fleet/:fleetId/read/:notificationId')
  @ApiOperation(
    buildApiOperationOptions([{ service: 'P', method: 'POST', url: 'api/v1/fleets/{id}/notifications/{id}/:read' }]),
  )
  @ApiResponse({ status: HttpStatus.OK, description: 'Success' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request', type: ApiErrorResponseEntity })
  public markSingleNotificationAsRead(
    @UserToken() token: Jwt,
    @Param('fleetId') fleetId: string,
    @Param('notificationId') notificationId: string,
  ): Observable<void> {
    return this.notificationsService.markSingleNotificationAsRead(fleetId, notificationId, token);
  }

  @Post('fleet/:fleetId/read')
  @ApiOperation(
    buildApiOperationOptions([{ service: 'P', method: 'POST', url: 'api/v1/fleets/{id}/notifications/:read' }]),
  )
  @ApiBody({ type: NotificationsIdsCollectionEntity })
  @ApiResponse({ status: HttpStatus.OK, description: 'Success' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request', type: ApiErrorResponseEntity })
  public markMultipleNotificationAsRead(
    @UserToken() token: Jwt,
    @Param('fleetId') fleetId: string,
    @Body() body: CollectionDto<string>,
  ): Observable<void> {
    return this.notificationsService.markMultipleNotificationAsRead(fleetId, body, token);
  }

  @Post('fleet/:fleetId/read/all')
  @ApiOperation(
    buildApiOperationOptions([{ service: 'P', method: 'POST', url: 'api/v1/fleets/{id}/notifications/all/:read' }]),
  )
  @ApiResponse({ status: HttpStatus.OK, description: 'Success' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request', type: ApiErrorResponseEntity })
  public markAllNotificationAsRead(@UserToken() token: Jwt, @Param('fleetId') fleetId: string): Observable<void> {
    return this.notificationsService.markAllNotificationAsRead(fleetId, token);
  }

  @Post('fleet/:fleetId/unread/:notificationId')
  @ApiOperation(
    buildApiOperationOptions([{ service: 'P', method: 'POST', url: 'api/v1/fleets/{id}/notifications/{id}/:unread' }]),
  )
  @ApiResponse({ status: HttpStatus.OK, description: 'Success' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request', type: ApiErrorResponseEntity })
  public markSingleNotificationAsUnread(
    @UserToken() token: Jwt,
    @Param('fleetId') fleetId: string,
    @Param('notificationId') notificationId: string,
  ): Observable<void> {
    return this.notificationsService.markSingleNotificationAsUnread(fleetId, notificationId, token);
  }

  @Get('fleet/:fleetId/bulk/top-unread')
  @ApiOperation(
    buildApiOperationOptions([
      { service: 'P', method: 'GET', url: 'api/v1/fleets/{fleet-id}/notifications/bulk/top-unread' },
    ]),
  )
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request', type: ApiErrorResponseEntity })
  @PaginationCollectionOkResponse(NotificationItemEntity)
  public getTopUnreadCustomNotifications(
    @Param('fleetId') fleetId: string,
    @Query('topCount') topCount: number,
    @UserToken() token: Jwt,
  ): Observable<PaginationCollectionDto<NotificationItemDto>> {
    return this.notificationsService.getTopUnreadCustomNotifications(fleetId, topCount, token);
  }

  @Get('fleet/:fleetId/notifications/:notificationId/details')
  @ApiOperation(
    buildApiOperationOptions([
      { service: 'P', method: 'GET', url: 'api/v1/fleets/{fleet-id}/notifications/{notification-id}' },
    ]),
  )
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: NotificationDetailsEntity })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request', type: ApiErrorResponseEntity })
  public getNotificationDetails(
    @Param('fleetId') fleetId: string,
    @Param('notificationId') notificationId: string,
    @UserToken() token: Jwt,
  ): Observable<NotificationDetailsDto> {
    return this.notificationsService.getNotificationDetails(fleetId, notificationId, token);
  }

  @Post('fleet/:fleetId/notifications/:notificationId/accept')
  @ApiOperation(
    buildApiOperationOptions([
      { service: 'P', method: 'POST', url: 'api/v1/fleets/{fleet-id}/notifications/{notification-id}/:accept' },
    ]),
  )
  @ApiResponse({ status: HttpStatus.OK, description: 'Success' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request', type: ApiErrorResponseEntity })
  public acceptNotification(
    @UserToken() token: Jwt,
    @Param('fleetId') fleetId: string,
    @Param('notificationId') notificationId: string,
  ): Observable<void> {
    return this.notificationsService.acceptNotification(fleetId, notificationId, token);
  }
}
