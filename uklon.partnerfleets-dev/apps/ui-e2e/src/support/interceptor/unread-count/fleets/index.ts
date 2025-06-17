import { fleetFaker } from '../../../faker';
import { BuildProps } from '../../../faker/modules/notifications/fleets-unread';
import { BaseInterceptor, InterceptorReturnType } from '../../_internal';

export class FleetsUnreadCountIntercept extends BaseInterceptor<BuildProps> {
  constructor() {
    super(`api/notifications/fleet/unread-count`, 'POST');
  }

  protected ok(props?: BuildProps): InterceptorReturnType {
    return this.intercept({
      statusCode: 200,
      body: fleetFaker.fleetsNotificationsHistory.buildDto(props),
    });
  }

  protected bad(): InterceptorReturnType {
    return this.intercept({
      statusCode: 400,
    });
  }
}

export const fleetsUnreadCountIntercept = new FleetsUnreadCountIntercept();
