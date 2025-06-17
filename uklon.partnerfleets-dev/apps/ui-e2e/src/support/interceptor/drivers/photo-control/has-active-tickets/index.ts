import { fleetFaker } from '../../../../faker';
import { BuildProps } from '../../../../faker/modules/drivers/photo-control/has-active-tickets';
import { BaseInterceptor, InterceptorReturnType } from '../../../_internal';

export class DriverPhotoControlHasActiveTicketsIntercept extends BaseInterceptor<BuildProps> {
  constructor(fleetId: string) {
    super(`api/fleets/${fleetId}/drivers/driver-photo-control/has-active-tickets`, 'GET');
  }

  protected ok(props?: BuildProps): InterceptorReturnType {
    return this.intercept({
      statusCode: 200,
      body: fleetFaker.driverPhotoControlHasActiveTickets.buildDto(props),
    });
  }

  protected bad(): InterceptorReturnType {
    return this.intercept({
      statusCode: 400,
    });
  }
}
