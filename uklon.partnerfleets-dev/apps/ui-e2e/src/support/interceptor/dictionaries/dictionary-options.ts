import { fleetFaker } from '../../faker';
import { BuildProps } from '../../faker/modules/dictionaries/dictionary-options';
import { BaseInterceptor, InterceptorReturnType } from '../_internal';

export class DictionaryOptionsInterceptor extends BaseInterceptor<BuildProps> {
  constructor() {
    super(`/api/dictionaries/options?regionId=*`, 'GET');
  }

  protected ok(props?: BuildProps): InterceptorReturnType {
    return this.intercept({
      statusCode: 200,
      body: fleetFaker.dictionaryOptions.buildDto(props),
    });
  }

  protected bad(): InterceptorReturnType {
    return this.intercept({
      statusCode: 400,
    });
  }
}
