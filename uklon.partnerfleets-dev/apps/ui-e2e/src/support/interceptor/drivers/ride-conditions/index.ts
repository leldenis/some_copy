import { fleetFaker } from '../../../faker';
import { BuildProps } from '../../../faker/modules/driver/ride-conditions';
import { BaseInterceptor, InterceptorReturnType } from '../../_internal';

export class FleetDriverRideConditionsIntercept extends BaseInterceptor<BuildProps> {
  constructor(fleetId: string, driverId: string) {
    super(`api/fleets/${fleetId}/drivers/${driverId}/ride-conditions`, 'GET');
  }

  protected ok(props?: BuildProps): InterceptorReturnType {
    return this.intercept({
      statusCode: 200,
      body: fleetFaker.driverRideConditions.buildDto(props),
    });
  }

  protected bad(): InterceptorReturnType {
    return this.intercept({
      statusCode: 400,
    });
  }
}

export const fleetDriverRideConditionsIntercept = new FleetDriverRideConditionsIntercept('*', '*');
