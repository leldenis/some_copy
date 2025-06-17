import { fleetFaker } from '../../../../faker';
import { BuildProps } from '../../../../faker/modules/fleet-profile/fleet-rro/fiscalization-status';
import { BaseInterceptor, InterceptorReturnType } from '../../../_internal';

export class FleetFiscalizationStatusIntercept extends BaseInterceptor<BuildProps> {
  constructor(fleetId: string) {
    super(`api/fiscalization/${fleetId}/status`, 'GET');
  }

  protected ok(props?: BuildProps): InterceptorReturnType {
    return this.intercept({
      statusCode: 200,
      body: fleetFaker.fiscalizationStatus.buildDto(props),
    });
  }

  protected bad(): InterceptorReturnType {
    return this.intercept({
      statusCode: 400,
    });
  }
}
