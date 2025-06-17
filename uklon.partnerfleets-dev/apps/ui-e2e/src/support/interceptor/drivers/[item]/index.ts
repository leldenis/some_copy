import { fleetFaker } from '../../../faker';
import { BuildProps } from '../../../faker/modules/driver';
import { BaseInterceptor, InterceptorReturnType } from '../../_internal';

export class FleetDriverIntercept extends BaseInterceptor<BuildProps> {
  constructor(fleetId: string, driverId: string) {
    super(`api/fleets/${fleetId}/drivers/${driverId}`, 'GET');
  }

  protected ok(props?: BuildProps): InterceptorReturnType {
    return this.intercept({
      statusCode: 200,
      body: fleetFaker.driver.buildDto(props),
    });
  }

  protected bad(): InterceptorReturnType {
    return this.intercept({
      statusCode: 400,
    });
  }
}

export const fleetDriverIntercept = new FleetDriverIntercept('*', '*');
