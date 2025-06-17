import { fleetFaker } from '../../../../faker';
import { BuildProps } from '../../../../faker/modules/vehicle/change-history-details';
import { BaseInterceptor, InterceptorReturnType } from '../../../_internal';

export class FleetVehicleChangesHistoryDetailsIntercept extends BaseInterceptor<BuildProps> {
  constructor(fleetId = '*', vehicleId = '*', eventType = '*', eventId = '*') {
    super(`api/fleets/${fleetId}/vehicles/${vehicleId}/changes-history/${eventType}/${eventId}`, 'GET');
  }

  protected ok(props?: BuildProps): InterceptorReturnType {
    return this.intercept({
      statusCode: 200,
      body: fleetFaker.vehicleChangesHistoryDetails.buildDto(props),
    });
  }

  protected bad(): InterceptorReturnType {
    return this.intercept({
      statusCode: 400,
    });
  }
}

export const fleetVehicleChangesHistoryDetailsIntercept = new FleetVehicleChangesHistoryDetailsIntercept('*', '*', '*');
