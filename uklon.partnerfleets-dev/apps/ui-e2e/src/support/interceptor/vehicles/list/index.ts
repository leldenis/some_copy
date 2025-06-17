import { fleetFaker } from '../../../faker';
import { BuildProps } from '../../../faker/modules/vehicle/list';
import { BaseInterceptor, InterceptorReturnType } from '../../_internal';

export class FleetVehiclesListIntercept extends BaseInterceptor<BuildProps> {
  constructor(fleetId: string, query: string) {
    super(`api/fleets/${fleetId}/vehicles?${query}`, 'GET');
  }

  protected ok(props?: BuildProps): InterceptorReturnType {
    return this.intercept({
      statusCode: 200,
      body: fleetFaker.fleetVehiclesList.buildDto(props),
    });
  }

  protected bad(): InterceptorReturnType {
    return this.intercept({
      statusCode: 400,
    });
  }
}
