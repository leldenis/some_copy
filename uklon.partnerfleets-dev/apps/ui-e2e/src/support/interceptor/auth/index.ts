import { fleetFaker } from '../../faker';
import { BuildProps } from '../../faker/modules/identity';
import { BaseInterceptor, InterceptorReturnType } from '../_internal';

export class AuthIntercept extends BaseInterceptor<BuildProps> {
  constructor() {
    super('api/auth', 'POST');
  }

  protected ok(props?: BuildProps): InterceptorReturnType {
    return this.intercept({
      statusCode: 200,
      body: fleetFaker.identity.buildDto(props),
    });
  }

  protected bad(): InterceptorReturnType {
    return this.intercept({
      statusCode: 400,
      body: {
        code: 400,
        sub_code: 4300,
        sub_code_description: 'auth_grant_failed',
        message: 'Login or password incorrect.',
      },
    });
  }
}

export const authIntercept = new AuthIntercept();
