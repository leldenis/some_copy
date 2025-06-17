import { fleetFaker } from '../../../faker';
import { BuildProps } from '../../../faker/modules/driver/finance-profile';
import { BaseInterceptor, InterceptorReturnType } from '../../_internal';

export class FleetDriverFinanceProfileIntercept extends BaseInterceptor<BuildProps> {
  constructor(fleetId: string, driverId: string) {
    super(`api/fleets/${fleetId}/drivers/${driverId}/finance-profile`, 'GET');
  }

  protected ok(props?: BuildProps): InterceptorReturnType {
    return this.intercept({
      statusCode: 200,
      body: fleetFaker.fleetDriverFinanceProfileIntercept.buildDto(props),
    });
  }

  protected bad(): InterceptorReturnType {
    return this.intercept({
      statusCode: 400,
    });
  }
}

export const fleetDriverFinanceProfileIntercept = new FleetDriverFinanceProfileIntercept('*', '*');
