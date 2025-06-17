import { BaseInterceptor, InterceptorReturnType } from '../../../_internal';

export class BrandingCalculationPeriodsOldInterceptor extends BaseInterceptor<unknown> {
  constructor() {
    super('api/bonuses/branding-calculation-periods*', 'GET');
  }

  protected ok(): InterceptorReturnType {
    return this.intercept({
      fixture: 'bonuses/branding-calculation-periods-old/branding-calculation-periods-old.json',
    });
  }

  protected bad(): InterceptorReturnType {
    return this.intercept({
      statusCode: 400,
    });
  }
}
