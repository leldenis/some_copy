import { fleetFaker } from '../../../faker';
import { BuildProps } from '../../../faker/modules/finance/payment-card';
import { BaseInterceptor, InterceptorReturnType } from '../../_internal';

export class FleetPaymentCardIntercept extends BaseInterceptor<BuildProps> {
  constructor(fleetId = '*') {
    super(`api/fleets/${fleetId}/finance/payment-card`, 'GET');
  }

  protected ok(props?: BuildProps): InterceptorReturnType {
    return this.intercept({
      statusCode: 200,
      body: fleetFaker.fleetPaymentCard.buildDto(props),
    });
  }

  protected bad(): InterceptorReturnType {
    return this.intercept({
      statusCode: 400,
    });
  }
}

export const fleetPaymentCardIntercept = new FleetPaymentCardIntercept();
