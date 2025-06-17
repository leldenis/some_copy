import { fleetFaker } from '../../../faker';
import { BuildProps } from '../../../faker/modules/fleet-profile/fleet-history';
import { BaseInterceptor, InterceptorReturnType } from '../../_internal';

export class FleetHistoryIntercept extends BaseInterceptor<BuildProps> {
  constructor(fleetId = '*') {
    super(`api/fleets/${fleetId}/history?*`, 'GET');
  }

  protected ok(props?: BuildProps): InterceptorReturnType {
    return this.intercept({
      statusCode: 200,
      body: fleetFaker.fleetHistory.buildDto(props),
    });
  }

  protected bad(): InterceptorReturnType {
    return this.intercept({
      statusCode: 400,
    });
  }
}

export const fleetHistoryIntercept = new FleetHistoryIntercept();
