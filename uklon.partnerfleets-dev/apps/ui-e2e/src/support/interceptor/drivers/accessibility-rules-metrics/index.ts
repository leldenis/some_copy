import { fleetFaker } from '../../../faker';
import { BuildProps } from '../../../faker/modules/driver/accessibility-rules-metrics';
import { BaseInterceptor, InterceptorReturnType } from '../../_internal';

export class FleetDriverAccessibilityRulesMetricsIntercept extends BaseInterceptor<BuildProps> {
  constructor(fleetId: string, driverId: string) {
    super(`api/fleets/${fleetId}/drivers/${driverId}/accessibility-rules-metrics`, 'GET');
  }

  protected ok(props?: BuildProps): InterceptorReturnType {
    return this.intercept({
      statusCode: 200,
      body: fleetFaker.driverAccessibilityRulesMetricsIntercept.buildDto(props),
    });
  }

  protected bad(): InterceptorReturnType {
    return this.intercept({
      statusCode: 400,
    });
  }
}

export const driverAccessibilityRulesMetricsIntercept = new FleetDriverAccessibilityRulesMetricsIntercept('*', '*');
