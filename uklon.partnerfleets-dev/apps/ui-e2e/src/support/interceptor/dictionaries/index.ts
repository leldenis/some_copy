import { BaseInterceptor, InterceptorReturnType } from '../_internal';

export class DictionariesIntercept extends BaseInterceptor<unknown> {
  constructor() {
    super('api/dictionaries', 'GET');
  }

  protected ok(): InterceptorReturnType {
    return this.intercept({
      fixture: 'api/dictionaries/all.200.json',
    });
  }

  protected bad(): InterceptorReturnType {
    return this.intercept({
      statusCode: 400,
    });
  }
}

export const dictionariesIntercept = new DictionariesIntercept();
