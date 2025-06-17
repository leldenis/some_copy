import { fleetFaker } from '../../../../faker';
import { BuildProps } from '../../../../faker/modules/drivers/photo-control/list';
import { BaseInterceptor, InterceptorReturnType } from '../../../_internal';

export class DriverPhotoControlListIntercept extends BaseInterceptor<BuildProps> {
  constructor(fleetId: string, query: string) {
    super(`api/fleets/${fleetId}/drivers-photo-control-tickets?${query}`, 'GET');
  }

  protected ok(props?: BuildProps): InterceptorReturnType {
    return this.intercept({
      statusCode: 200,
      body: fleetFaker.driverPhotoControlList.buildDto(props),
    });
  }

  protected bad(): InterceptorReturnType {
    return this.intercept({
      statusCode: 400,
    });
  }
}
