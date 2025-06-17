import { fleetFaker } from '../../../faker';
import { BuildProps } from '../../../faker/modules/driver/photo-control';
import { BaseInterceptor, InterceptorReturnType } from '../../_internal';

export class DriverPhotoControlIntercept extends BaseInterceptor<BuildProps> {
  constructor(ticketId: string) {
    super(`api/fleets/driver-photo-control/${ticketId}`, 'GET');
  }

  protected ok(props?: BuildProps): InterceptorReturnType {
    return this.intercept({
      statusCode: 200,
      body: fleetFaker.driverPhotoControl.buildDto(props),
    });
  }

  protected bad(): InterceptorReturnType {
    return this.intercept({
      statusCode: 400,
    });
  }
}
