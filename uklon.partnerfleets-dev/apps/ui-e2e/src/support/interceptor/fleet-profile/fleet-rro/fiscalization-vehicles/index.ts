import { fleetFaker } from '../../../../faker';
import { BuildProps } from '../../../../faker/modules/fleet-profile/fleet-rro/fiscalization-vehicles';
import { BaseInterceptor, InterceptorReturnType } from '../../../_internal';

export class FleetFiscalizationVehiclesIntercept extends BaseInterceptor<BuildProps> {
  constructor(fleetId: string) {
    super(`api/fiscalization/${fleetId}/vehicles?limit=30&offset=0&licencePlate=`, 'GET');
  }

  protected ok(props?: BuildProps): InterceptorReturnType {
    return this.intercept({
      statusCode: 200,
      body: fleetFaker.fiscalizationVehicles.buildDto(props),
    });
  }

  protected bad(): InterceptorReturnType {
    return this.intercept({
      statusCode: 400,
    });
  }
}
