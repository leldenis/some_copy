import { fleetFaker } from '../../faker';
import { BuildProps } from '../../faker/modules/dashboard-statistics';
import { BaseInterceptor, InterceptorReturnType } from '../_internal';

export class DashboardStatisticsIntercept extends BaseInterceptor<BuildProps> {
  constructor(fleetId: string) {
    super(`api/statistics/${fleetId}/dashboard*`, 'GET');
  }

  protected ok(props?: BuildProps): InterceptorReturnType {
    return this.intercept({
      statusCode: 200,
      body: fleetFaker.dashboardStatistics.buildDto(props),
    });
  }

  protected bad(): InterceptorReturnType {
    return this.intercept({
      statusCode: 400,
    });
  }
}

export const dashboardStatisticsIntercept = new DashboardStatisticsIntercept('*');
