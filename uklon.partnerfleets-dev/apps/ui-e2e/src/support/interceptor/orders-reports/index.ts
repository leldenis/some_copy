import { fleetFaker } from '../../faker';
import { BuildProps } from '../../faker/modules/orders-reports';
import { BaseInterceptor, InterceptorReturnType } from '../_internal';

export class FleetOrdersReportsIntercept extends BaseInterceptor<BuildProps> {
  constructor(fleetId: string, query: string) {
    super(`api/fleets/reports/${fleetId}/drivers-orders?${query}`, 'GET');
  }

  protected ok(props?: BuildProps): InterceptorReturnType {
    return this.intercept({
      statusCode: 200,
      body: fleetFaker.fleetOrdersReports.buildDto(props),
    });
  }

  protected bad(): InterceptorReturnType {
    return this.intercept({
      statusCode: 400,
    });
  }
}
