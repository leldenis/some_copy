import { BaseInterceptor, InterceptorReturnType } from '../_internal';

interface BuildProps {
  count: number;
}

export class UnreadCountIntercept extends BaseInterceptor<BuildProps> {
  constructor(fleetId: string) {
    super(`api/notifications/fleet/${fleetId}/unread-count`, 'GET');
  }

  protected ok(props?: BuildProps): InterceptorReturnType {
    return this.intercept({
      statusCode: 200,
      body: { unread_count: props?.count ?? 0 },
    });
  }

  protected bad(): InterceptorReturnType {
    return this.intercept({
      statusCode: 400,
    });
  }
}

export const unreadCountIntercept = new UnreadCountIntercept('*');
