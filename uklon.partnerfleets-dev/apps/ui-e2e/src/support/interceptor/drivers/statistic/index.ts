import { fleetFaker } from '../../../faker';
import { BuildProps } from '../../../faker/modules/driver/statistic';
import { BaseInterceptor, InterceptorReturnType } from '../../_internal';

export class FleetDriverStatisticIntercept extends BaseInterceptor<BuildProps> {
  constructor(fleetId: string, driverId: string, query: string) {
    super(`api/fleets/${fleetId}/drivers/${driverId}/statistic?${query}`, 'GET');
  }

  protected ok(props?: BuildProps): InterceptorReturnType {
    return this.intercept({
      statusCode: 200,
      body: fleetFaker.fleetDriverStatistic.buildDto(props),
    });
  }

  protected bad(): InterceptorReturnType {
    return this.intercept({
      statusCode: 400,
    });
  }
}

export const fleetDriverStatisticIntercept = new FleetDriverStatisticIntercept('*', '*', '*');
