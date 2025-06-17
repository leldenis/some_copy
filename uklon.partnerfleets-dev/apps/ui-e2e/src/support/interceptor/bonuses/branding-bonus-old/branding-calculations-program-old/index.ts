import { BaseInterceptor, InterceptorReturnType } from '../../../_internal';

export class BrandingCalculationsProgramOldInterceptor extends BaseInterceptor<unknown> {
  constructor() {
    super('api/bonuses/branding-calculations-program?*', 'GET');
  }

  protected ok(): InterceptorReturnType {
    return this.intercept({
      fixture: 'bonuses/branding-calculations-program-old/branding-calculations-program-old.json',
    });
  }

  protected bad(): InterceptorReturnType {
    return this.intercept({
      statusCode: 400,
    });
  }
}
