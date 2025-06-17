import { fleetFaker } from '../../faker';
import { BuildProps } from '../../faker/modules/user-country';
import { BaseInterceptor, InterceptorReturnType } from '../_internal';

export class UserCountryIntercept extends BaseInterceptor<BuildProps> {
  constructor() {
    super('api/me/user-country', 'GET');
  }

  protected ok(props?: BuildProps): InterceptorReturnType {
    return this.intercept({
      statusCode: 200,
      body: fleetFaker.userCountry.buildDto(props),
    });
  }

  protected bad(): InterceptorReturnType {
    return this.intercept({
      statusCode: 400,
    });
  }
}

export const userCountryIntercept = new UserCountryIntercept();
