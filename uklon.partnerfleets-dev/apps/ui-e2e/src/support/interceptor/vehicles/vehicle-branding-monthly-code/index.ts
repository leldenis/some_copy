import { BaseInterceptor, InterceptorReturnType } from '../../_internal';

export class VehicleBrandingMonthlyCodeIntercept extends BaseInterceptor<unknown> {
  constructor() {
    super(`api/tickets/vehicle-brandings/monthly-code`, 'GET');
  }

  protected ok(): InterceptorReturnType {
    return this.intercept({
      fixture: 'vehicles/vehicle-branding-period-monthly-code/vehicle-branding-period-monthly-code.json',
    });
  }

  protected bad(): InterceptorReturnType {
    return this.intercept({
      statusCode: 400,
    });
  }
}
