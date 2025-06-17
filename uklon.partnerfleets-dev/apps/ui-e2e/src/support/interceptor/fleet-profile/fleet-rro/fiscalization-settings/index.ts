import { fleetFaker } from '../../../../faker';
import { BuildProps } from '../../../../faker/modules/fleet-profile/fleet-rro/fiscalization-settings';
import { BaseInterceptor, InterceptorReturnType } from '../../../_internal';

export class FleetFiscalizationSettingsIntercept extends BaseInterceptor<BuildProps> {
  constructor(fleetId: string) {
    super(`api/fiscalization/${fleetId}/settings`, 'GET');
  }

  protected ok(props?: BuildProps): InterceptorReturnType {
    return this.intercept({
      statusCode: 200,
      body: fleetFaker.fiscalizationSettings.buildDto(props),
    });
  }

  protected bad(): InterceptorReturnType {
    return this.intercept({
      statusCode: 400,
    });
  }
}
