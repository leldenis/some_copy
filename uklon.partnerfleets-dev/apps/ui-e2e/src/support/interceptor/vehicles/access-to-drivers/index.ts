import { fleetFaker } from '../../../faker';
import { BuildProps } from '../../../faker/modules/driver/access-to-vehicles';
import { BaseInterceptor, InterceptorReturnType } from '../../_internal';

export class FleetVehicleAccessToDriversIntercept extends BaseInterceptor<BuildProps> {
  constructor(fleetId = '*', vehicleId = '*') {
    super(`api/fleets/${fleetId}/vehicles/${vehicleId}/access-to-drivers`, 'GET');
  }

  protected ok(props?: BuildProps): InterceptorReturnType {
    return this.intercept({
      statusCode: 200,
      body: fleetFaker.vehicleAccessToDrivers.buildDto(props),
    });
  }

  protected bad(): InterceptorReturnType {
    return this.intercept({
      statusCode: 400,
    });
  }
}

export const vehicleAccessToDriversIntercept = new FleetVehicleAccessToDriversIntercept('*', '*');
