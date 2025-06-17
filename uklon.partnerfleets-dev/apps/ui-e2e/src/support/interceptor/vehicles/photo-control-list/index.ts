import { fleetFaker } from '../../../faker';
import { BuildProps } from '../../../faker/modules/vehicle/photo-control-list';
import { BaseInterceptor, InterceptorReturnType } from '../../_internal';

export class FleetPhotoControlListIntercept extends BaseInterceptor<BuildProps> {
  constructor(fleetId: string, query: string) {
    super(`api/tickets/fleets/${fleetId}/vehicles/vehicle-photo-control?${query}`, 'GET');
  }

  protected ok(props?: BuildProps): InterceptorReturnType {
    return this.intercept({
      statusCode: 200,
      body: fleetFaker.fleetPhotoControlList.buildDto(props),
    });
  }

  protected bad(): InterceptorReturnType {
    return this.intercept({
      statusCode: 400,
    });
  }
}
