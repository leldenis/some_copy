import { fleetFaker } from '../../../../faker';
import { BuildProps } from '../../../../faker/modules/bonuses/branding-bonus/program-details';
import { BaseInterceptor, InterceptorReturnType } from '../../../_internal';

export class BrandingProgramsDetailsInterceptor extends BaseInterceptor<BuildProps> {
  constructor(public readonly calculationId: string) {
    super(`/api/bonuses/branding/calculations/${calculationId}/program-details`, 'GET');
  }

  protected ok(props?: BuildProps): InterceptorReturnType {
    return this.intercept({
      statusCode: 200,
      body: fleetFaker.brandingProgramsDetails.buildDto(props),
    });
  }

  protected bad(): InterceptorReturnType {
    return this.intercept({
      statusCode: 400,
    });
  }
}
