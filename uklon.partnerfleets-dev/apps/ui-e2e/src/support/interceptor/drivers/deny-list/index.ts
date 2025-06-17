import { BaseInterceptor, InterceptorReturnType } from '../../_internal';

export class FleetDriverDenyListIntercept extends BaseInterceptor<{ count: number }> {
  constructor() {
    super(`/api/fleets/drivers/*/deny-list`, 'GET');
  }

  protected ok<T>(count: number = 0): InterceptorReturnType<T> {
    return this.intercept({
      statusCode: 200,
      body: { count },
    });
  }

  protected bad<T>(): InterceptorReturnType<T> {
    return this.intercept({
      statusCode: 400,
    });
  }
}

export const fleetDriverDenyListIntercept = new FleetDriverDenyListIntercept();
