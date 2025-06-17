import { BaseInterceptor, InterceptorReturnType } from '../_internal';

export class AnalyticIntercept extends BaseInterceptor<unknown> {
  constructor() {
    super('api/analytics/*', 'POST');
  }

  protected ok(): InterceptorReturnType {
    return this.intercept({
      statusCode: 200,
    });
  }

  protected bad(): InterceptorReturnType {
    return this.intercept({
      statusCode: 400,
    });
  }
}

export const analyticIntercept = new AnalyticIntercept();
