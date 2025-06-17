import { fleetFaker } from '../../../faker';
import { BuildProps } from '../../../faker/modules/driver/change-history-details';
import { BaseInterceptor, InterceptorReturnType } from '../../_internal';

export class FleetDriverChangesHistoryDetailsIntercept extends BaseInterceptor<BuildProps> {
  constructor(driverId: string, eventType: string, eventId: string) {
    super(`api/fleets/drivers/${driverId}/changes-history/${eventType}/${eventId}`, 'GET');
  }

  protected ok(props?: BuildProps): InterceptorReturnType {
    return this.intercept({
      statusCode: 200,
      body: fleetFaker.driverChangesHistoryDetails.buildDto(props),
    });
  }

  protected bad(): InterceptorReturnType {
    return this.intercept({
      statusCode: 400,
    });
  }
}

export const fleetDriverChangesHistoryDetailsIntercept = new FleetDriverChangesHistoryDetailsIntercept('*', '*', '*');
