import { fleetFaker } from '../../../faker';
import { BuildProps } from '../../../faker/modules/fleet-profile/fleet-history-details';
import { BaseInterceptor, InterceptorReturnType } from '../../_internal';

export class FleetHistoryDetailsIntercept extends BaseInterceptor<BuildProps> {
  constructor(fleetId: string, type: string) {
    super(`api/fleets/${fleetId}/history/${type}/*`, 'GET');
  }

  protected ok(props?: BuildProps): InterceptorReturnType {
    return this.intercept({
      statusCode: 200,
      body: fleetFaker.fleetHistoryDetails.buildDto(props),
    });
  }

  protected bad(): InterceptorReturnType {
    return this.intercept({
      statusCode: 400,
    });
  }
}
