import { fleetFaker } from '../../../faker';
import { BuildProps } from '../../../faker/modules/driver/access-to-vehicles';
import { BaseInterceptor, InterceptorReturnType } from '../../_internal';

export class FleetDriverAccessToVehicleIntercept extends BaseInterceptor<BuildProps> {
  constructor(fleetId: string, driverId: string) {
    super(`api/fleets/${fleetId}/drivers/${driverId}/access-to-vehicles`, 'GET');
  }

  protected ok(props?: BuildProps): InterceptorReturnType {
    return this.intercept({
      statusCode: 200,
      body: fleetFaker.driverAccessToVehicleIntercept.buildDto(props),
    });
  }

  protected bad(): InterceptorReturnType {
    return this.intercept({
      statusCode: 400,
    });
  }
}

export const driverAccessToVehicleIntercept = new FleetDriverAccessToVehicleIntercept('*', '*');
