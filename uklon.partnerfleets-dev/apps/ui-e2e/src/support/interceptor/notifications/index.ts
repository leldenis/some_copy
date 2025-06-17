import { fleetFaker } from '../../faker';
import { BuildProps } from '../../faker/modules/notifications';
import { BaseInterceptor, InterceptorReturnType } from '../_internal';

export class NotificationsHistoryIntercept extends BaseInterceptor<BuildProps> {
  constructor() {
    super('api/notifications/fleet/*?cursor=*&limit=*', 'GET');
  }

  protected ok(props?: BuildProps): InterceptorReturnType {
    return this.intercept({
      statusCode: 200,
      body: fleetFaker.notificationsHistory.buildDto(props),
    });
  }

  protected bad(): InterceptorReturnType {
    return this.intercept({
      statusCode: 400,
    });
  }
}

export class TopUnreadNotificationsIntercept extends BaseInterceptor<BuildProps> {
  constructor() {
    super('api/notifications/fleet/*/bulk/top-unread*', 'GET');
  }

  protected ok(props?: BuildProps): InterceptorReturnType {
    return this.intercept({
      statusCode: 200,
      body: fleetFaker.topUnreadNotifications.buildDto(props),
    });
  }

  protected bad(): InterceptorReturnType {
    return this.intercept({
      statusCode: 400,
    });
  }
}

export class NotificationDetailsIntercept extends BaseInterceptor<BuildProps> {
  constructor() {
    super('api/notifications/fleet/*/notifications/*/details');
  }

  protected ok(props?: BuildProps): InterceptorReturnType {
    return this.intercept({
      statusCode: 200,
      body: fleetFaker.notificationDetails.buildDto(props),
    });
  }

  protected bad(): InterceptorReturnType {
    return this.intercept({
      statusCode: 400,
    });
  }
}

export const notificationsHistoryIntercept = new NotificationsHistoryIntercept();
export const topUnreadNotificationsIntercept = new TopUnreadNotificationsIntercept();
