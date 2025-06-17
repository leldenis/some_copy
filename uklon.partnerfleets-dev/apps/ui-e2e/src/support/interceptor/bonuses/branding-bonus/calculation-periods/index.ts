import { fleetFaker } from '../../../../faker';
import { BuildProps } from '../../../../faker/modules/bonuses/branding-bonus/calculation-periods';
import { BaseInterceptor, InterceptorReturnType } from '../../../_internal';

export class BrandingCalculationPeriodsInterceptor extends BaseInterceptor<BuildProps> {
  constructor(
    public readonly fleetId: string,
    public readonly programId: string,
  ) {
    super(`/api/bonuses/branding-periods?fleet_id=${fleetId}&program_id=${programId}`, 'GET');
  }

  protected ok(props?: BuildProps): InterceptorReturnType {
    return this.intercept({
      statusCode: 200,
      body: fleetFaker.brandingCalculationPeriods.buildDto(props),
    });
  }

  protected bad(): InterceptorReturnType {
    return this.intercept({
      statusCode: 400,
    });
  }
}
