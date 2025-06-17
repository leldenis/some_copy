import { fleetFaker } from '../../faker';
import { BuildProps } from '../../faker/modules/account';
import { BaseInterceptor, InterceptorReturnType } from '../_internal';

export class MeIntercept extends BaseInterceptor<BuildProps> {
  constructor() {
    super('api/me', 'GET');
  }

  protected ok(props?: BuildProps): InterceptorReturnType {
    return this.intercept({
      statusCode: 200,
      body: fleetFaker.account.buildDto(props),
    });
  }

  protected bad(): InterceptorReturnType {
    return this.intercept({
      statusCode: 400,
    });
  }
}

export const meIntercept = new MeIntercept();
