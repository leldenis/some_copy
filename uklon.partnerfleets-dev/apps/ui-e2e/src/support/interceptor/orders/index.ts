import { fleetFaker } from '../../faker';
import { BuildProps } from '../../faker/modules/orders';
import { BaseInterceptor, InterceptorReturnType } from '../_internal';

export class FleetOrdersIntercept extends BaseInterceptor<BuildProps> {
  constructor(query: string) {
    super(`api/fleets/orders?${query}`, 'GET');
  }

  protected ok(props?: BuildProps): InterceptorReturnType {
    return this.intercept({
      statusCode: 200,
      body: fleetFaker.fleetOrders.buildDto(props),
    });
  }

  protected bad(): InterceptorReturnType {
    return this.intercept({
      statusCode: 400,
    });
  }
}
