import { fleetFaker } from '../../../faker';
import { BuildProps } from '../../../faker/modules/fleet-profile/fleet-details';
import { BaseInterceptor, InterceptorReturnType } from '../../_internal';

export class FleetDetailsIntercept extends BaseInterceptor<BuildProps> {
  constructor(fleetId: string) {
    super(`api/fleets/${fleetId}`, 'GET');
  }

  protected ok(props?: BuildProps): InterceptorReturnType {
    return this.intercept({
      statusCode: 200,
      body: fleetFaker.fleetDetails.buildDto(props),
    });
  }

  protected bad(): InterceptorReturnType {
    return this.intercept({
      statusCode: 400,
    });
  }
}

export const fleetDetailsIntercept = new FleetDetailsIntercept('*');
