import { fleetFaker } from '../../../faker';
import { BuildProps } from '../../../faker/modules/driver/active-filters';
import { BaseInterceptor, InterceptorReturnType } from '../../_internal';

export class DriverActiveFiltersIntercept extends BaseInterceptor<BuildProps> {
  constructor() {
    super(`api/fleets/*/drivers/*/filters/active?regionId=*`, 'GET');
  }

  protected ok(props?: BuildProps): InterceptorReturnType {
    return this.intercept({
      statusCode: 200,
      body: fleetFaker.driverActiveFilters.buildDto(props),
    });
  }

  protected bad(): InterceptorReturnType {
    return this.intercept({
      statusCode: 400,
    });
  }
}

export const driverActiveFiltersIntercept = new DriverActiveFiltersIntercept();
