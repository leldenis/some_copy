import { fleetFaker } from '../../../../faker';
import { BuildProps } from '../../../../faker/modules/bonuses/branding-bonus-old/list';
import { BaseInterceptor, InterceptorReturnType } from '../../../_internal';

export class BrandingBonusProgramsListOldIntercept extends BaseInterceptor<BuildProps> {
  constructor(calculationId: string) {
    super(`api/bonuses/${calculationId}/branding-programs*`, 'GET');
  }

  protected ok(props?: BuildProps): InterceptorReturnType {
    return this.intercept({
      statusCode: 200,
      body: fleetFaker.brandingBonusProgramsListOld.buildDto(props),
    });
  }

  protected bad(): InterceptorReturnType {
    return this.intercept({
      statusCode: 400,
    });
  }
}
