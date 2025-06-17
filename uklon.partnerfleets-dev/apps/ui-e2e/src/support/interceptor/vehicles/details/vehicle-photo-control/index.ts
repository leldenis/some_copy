import { fleetFaker } from '../../../../faker';
import { BuildProps } from '../../../../faker/modules/vehicle/vehicle-photo-control';
import { BaseInterceptor, InterceptorReturnType } from '../../../_internal';

export class FleetVehiclePhotoControlIntercept extends BaseInterceptor<BuildProps> {
  constructor(ticketId: string) {
    super(`api/tickets/vehicle-photo-control/${ticketId}`, 'GET');
  }

  protected ok(props?: BuildProps): InterceptorReturnType {
    return this.intercept({
      statusCode: 200,
      body: fleetFaker.vehiclePhotoControl.buildDto(props),
    });
  }

  protected bad(): InterceptorReturnType {
    return this.intercept({
      statusCode: 400,
    });
  }
}
