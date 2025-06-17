import { fleetFaker } from '../../faker';
import { BuildProps } from '../../faker/modules/vehicle';
import { BaseInterceptor, InterceptorReturnType } from '../_internal';

export class FleetVehicleImagesIntercept extends BaseInterceptor<BuildProps> {
  constructor(fleetId: string, vehicleId: string, size = '*') {
    super(`api/fleets/${fleetId}/vehicles/${vehicleId}/images?image_size=${size}`, 'GET');
  }

  protected ok(props?: BuildProps): InterceptorReturnType {
    return this.intercept({
      statusCode: 200,
      body: fleetFaker.vehicleImages.buildDto(props),
    });
  }

  protected bad(): InterceptorReturnType {
    return this.intercept({
      statusCode: 400,
    });
  }
}

export const fleetVehicleImagesIntercept = new FleetVehicleImagesIntercept('*', '*');
