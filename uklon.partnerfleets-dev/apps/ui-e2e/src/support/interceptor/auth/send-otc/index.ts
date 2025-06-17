import { BaseInterceptor, InterceptorReturnType } from '../../_internal';

export class AuthSendOtcIntercept extends BaseInterceptor<unknown> {
  constructor() {
    super('api/auth/send-otc');
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

export const authSendOtcIntercept = new AuthSendOtcIntercept();
