import { BaseInterceptor, InterceptorReturnType } from '../_internal';

export class CountryPhoneFormatsIntercept extends BaseInterceptor<unknown> {
  constructor() {
    super('api/dictionaries/country-phone-formats', 'GET');
  }

  protected ok(): InterceptorReturnType {
    return this.intercept({
      fixture: 'api/dictionaries/country-phone-formats/all.200.json',
    });
  }

  protected bad(): InterceptorReturnType {
    return this.intercept({
      statusCode: 400,
    });
  }
}

export const countryPhoneFormatsIntercept = new CountryPhoneFormatsIntercept();
