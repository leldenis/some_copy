import { fleetFaker } from '../../../faker';
import { BuildProps } from '../../../faker/modules/vehicle/details';
import { BaseInterceptor, InterceptorReturnType } from '../../_internal';

export class FleetVehicleDetailsIntercept extends BaseInterceptor<BuildProps> {
  constructor(fleetId: string, vehicleId: string) {
    super(`api/fleets/${fleetId}/vehicles/${vehicleId}`, 'GET');
  }

  protected ok(props?: BuildProps): InterceptorReturnType {
    return this.intercept({
      statusCode: 200,
      body: fleetFaker.fleetVehicleDetails.buildDto(props),
    });
  }

  protected bad(): InterceptorReturnType {
    return this.intercept({
      statusCode: 400,
    });
  }
}
