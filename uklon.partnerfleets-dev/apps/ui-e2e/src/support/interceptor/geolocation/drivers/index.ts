import { fleetFaker } from '../../../faker';
import { BuildProps } from '../../../faker/modules/geolocation/drivers';
import { BaseInterceptor, InterceptorReturnType } from '../../_internal';

export class DriverGeolocationIntercept extends BaseInterceptor<BuildProps> {
  constructor(fleetId: string) {
    super(`api/geolocation/${fleetId}/drivers`, 'GET');
  }

  protected ok(props?: BuildProps): InterceptorReturnType {
    return this.intercept({
      statusCode: 200,
      body: fleetFaker.driverGeolocation.buildDto(props),
    });
  }

  protected bad(): InterceptorReturnType {
    return this.intercept({
      statusCode: 400,
    });
  }
}
