import { fleetFaker } from '../../../faker';
import { BuildProps } from '../../../faker/modules/driver/restrictions-settings';
import { BaseInterceptor, InterceptorReturnType } from '../../_internal';

export class FleetDriverRestrictionsSettingsIntercept extends BaseInterceptor<BuildProps> {
  constructor(fleetId: string, driverId: string) {
    super(`api/fleets/${fleetId}/drivers/${driverId}/restrictions/settings`, 'GET');
  }

  protected ok(props?: BuildProps): InterceptorReturnType {
    return this.intercept({
      statusCode: 200,
      body: fleetFaker.driverRestrictionsSettings.buildDto(props),
    });
  }

  protected bad(): InterceptorReturnType {
    return this.intercept({
      statusCode: 400,
    });
  }
}

export const fleetDriverREstrictionsSettingsIntercept = new FleetDriverRestrictionsSettingsIntercept('*', '*');
