import { fleetFaker } from '../../../../faker';
import { BuildProps } from '../../../../faker/modules/bonuses/branding-bonus/program-names';
import { BaseInterceptor, InterceptorReturnType } from '../../../_internal';

export class BrandingProgramNamesInterceptor extends BaseInterceptor<BuildProps> {
  constructor(public readonly regionId: string) {
    super(`/api/bonuses/branding-program-names?regionId=${regionId}`, 'GET');
  }

  protected ok(props?: BuildProps): InterceptorReturnType {
    return this.intercept({
      statusCode: 200,
      body: fleetFaker.brandingProgramNames.buildDto(props),
    });
  }

  protected bad(): InterceptorReturnType {
    return this.intercept({
      statusCode: 400,
    });
  }
}
