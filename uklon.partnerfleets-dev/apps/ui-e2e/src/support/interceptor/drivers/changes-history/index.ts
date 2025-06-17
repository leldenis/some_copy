import { fleetFaker } from '../../../faker';
import { BuildProps } from '../../../faker/modules/driver/changes-history';
import { BaseInterceptor, InterceptorReturnType } from '../../_internal';

export class FleetDriverChangesHistoryIntercept extends BaseInterceptor<BuildProps> {
  constructor(driverId: string, query: string) {
    super(`api/fleets/drivers/${driverId}/changes-history?${query}`, 'GET');
  }

  protected ok(props?: BuildProps): InterceptorReturnType {
    return this.intercept({
      statusCode: 200,
      body: fleetFaker.driverChangesHistory.buildDto(props),
    });
  }

  protected bad(): InterceptorReturnType {
    return this.intercept({
      statusCode: 400,
    });
  }
}

export const fleetDriverChangesHistoryIntercept = new FleetDriverChangesHistoryIntercept('*', '*');
