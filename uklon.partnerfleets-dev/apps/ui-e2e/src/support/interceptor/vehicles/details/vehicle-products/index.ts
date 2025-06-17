import { fleetFaker } from '../../../../faker';
import { BuildProps } from '../../../../faker/modules/vehicle/vehicle-products';
import { BaseInterceptor, InterceptorReturnType } from '../../../_internal';

export class FleetVehicleProductsIntercept extends BaseInterceptor<BuildProps> {
  constructor(fleetId: string, vehicleId: string) {
    super(`api/fleets/${fleetId}/vehicles/${vehicleId}/product-configurations`, 'GET');
  }

  protected ok(props?: BuildProps): InterceptorReturnType {
    return this.intercept({
      statusCode: 200,
      body: fleetFaker.fleetVehicleProducts.buildDto(props),
    });
  }

  protected bad(): InterceptorReturnType {
    return this.intercept({
      statusCode: 400,
    });
  }
}
