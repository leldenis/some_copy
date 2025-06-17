import { fleetFaker } from '../../../faker';
import { BuildProps } from '../../../faker/modules/driver/images';
import { BaseInterceptor, InterceptorReturnType } from '../../_internal';

export class FleetDriverImagesIntercept extends BaseInterceptor<BuildProps> {
  constructor(driverId: string, size = '*') {
    super(`api/fleets/drivers/${driverId}/images?image_size=${size}`, 'GET');
  }

  protected ok(props?: BuildProps): InterceptorReturnType {
    return this.intercept({
      statusCode: 200,
      body: fleetFaker.driverImages.buildDto(props),
    });
  }

  protected bad(): InterceptorReturnType {
    return this.intercept({
      statusCode: 400,
    });
  }
}

export const fleetDriverImagesIntercept = new FleetDriverImagesIntercept('*', '*');
