import { fleetFaker } from '../../../faker';
import { BuildProps } from '../../../faker/modules/drivers/photo-control/has-active-tickets';
import { BaseInterceptor, InterceptorReturnType } from '../../_internal';

export class VehiclePhotoControlHasActiveTicketsIntercept extends BaseInterceptor<BuildProps> {
  constructor(fleetId = '*') {
    super(`api/tickets/fleets/${fleetId}/vehicles/vehicle-photo-control/has-active-tickets`, 'GET');
  }

  protected ok(props?: BuildProps): InterceptorReturnType {
    return this.intercept({
      statusCode: 200,
      body: fleetFaker.vehiclePhotoControlHasActiveTickets.buildDto(props),
    });
  }

  protected bad(): InterceptorReturnType {
    return this.intercept({
      statusCode: 400,
    });
  }
}

export const vehiclePhotoControlHasActiveTicketsIntercept = new VehiclePhotoControlHasActiveTicketsIntercept();
