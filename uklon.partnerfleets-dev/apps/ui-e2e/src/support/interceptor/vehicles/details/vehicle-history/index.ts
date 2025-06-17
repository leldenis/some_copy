import { fleetFaker } from '../../../../faker';
import { BuildProps } from '../../../../faker/modules/vehicle/vehicle-history';
import { BaseInterceptor, InterceptorReturnType } from '../../../_internal';

export class FleetVehicleHistoryIntercept extends BaseInterceptor<BuildProps> {
  constructor(fleetId: string, vehicleId: string, changeType: string) {
    super(
      `api/fleets/${fleetId}/vehicles/${vehicleId}/changes-history?cursor=0&limit=20&fleetId=${fleetId}&changeType=${changeType}`,
      'GET',
    );
  }

  protected ok(props?: BuildProps): InterceptorReturnType {
    return this.intercept({
      statusCode: 200,
      body: fleetFaker.fleetVehicleHistory.buildDto(props),
    });
  }

  protected bad(): InterceptorReturnType {
    return this.intercept({
      statusCode: 400,
    });
  }
}
