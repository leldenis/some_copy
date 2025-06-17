import { fleetFaker } from '../../../faker';
import { BuildProps } from '../../../faker/modules/driver/restrictions';
import { BaseInterceptor, InterceptorReturnType } from '../../_internal';

export class FleetDriverRestrictionsIntercept extends BaseInterceptor<BuildProps> {
  constructor(fleetId: string, driverId: string) {
    super(`api/fleets/${fleetId}/drivers/${driverId}/restrictions`, 'GET');
  }

  protected ok(props?: BuildProps): InterceptorReturnType {
    return this.intercept({
      statusCode: 200,
      body: fleetFaker.driverRestrictions.buildDto(props),
    });
  }

  protected bad(): InterceptorReturnType {
    return this.intercept({
      statusCode: 400,
    });
  }
}

export const fleetDriverRestrictionsIntercept = new FleetDriverRestrictionsIntercept('*', '*');
