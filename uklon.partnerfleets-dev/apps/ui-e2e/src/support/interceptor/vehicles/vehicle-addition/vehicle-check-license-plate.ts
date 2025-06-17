import { fleetFaker } from '../../../faker';
import { BuildProps } from '../../../faker/modules/vehicle/vehicle-addition/vehicle-check-license-plate';
import { BaseInterceptor, InterceptorReturnType } from '../../_internal';

export class VehicleCheckLicensePlateInterceptor extends BaseInterceptor<BuildProps> {
  constructor(
    public readonly fleetId: string,
    public readonly licensePlate: string,
  ) {
    super(`/api/tickets/vehicle-addition/fleets/${fleetId}?licensePlate=${licensePlate}`, 'GET');
  }

  protected ok(props?: BuildProps): InterceptorReturnType {
    return this.intercept({
      statusCode: 200,
      body: fleetFaker.vehicleCheckLicensePlate.buildDto(props),
    });
  }

  protected bad(): InterceptorReturnType {
    return this.intercept({
      statusCode: 400,
    });
  }
}
