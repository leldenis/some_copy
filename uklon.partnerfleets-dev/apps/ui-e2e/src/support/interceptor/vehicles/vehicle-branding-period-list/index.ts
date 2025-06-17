import { fleetFaker } from '../../../faker';
import { BuildProps } from '../../../faker/modules/vehicle/vehicle-branding-period-list';
import { BaseInterceptor, InterceptorReturnType } from '../../_internal';

export class VehicleBrandingPeriodListIntercept extends BaseInterceptor<BuildProps> {
  constructor(fleetId: string, query: string) {
    super(`api/tickets/fleets/${fleetId}/vehicles/branding-periods?${query}`, 'GET');
  }

  protected ok(props?: BuildProps): InterceptorReturnType {
    return this.intercept({
      statusCode: 200,
      body: fleetFaker.vehicleBrandingPeriodList.buildDto(props),
    });
  }

  protected bad(): InterceptorReturnType {
    return this.intercept({
      statusCode: 400,
    });
  }
}
