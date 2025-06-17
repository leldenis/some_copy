import { fleetFaker } from '../../../../faker';
import { BuildProps } from '../../../../faker/modules/bonuses/branding-bonus/list';
import { BaseInterceptor, InterceptorReturnType } from '../../../_internal';

export class BrandingProgramsCalculationsListIntercept extends BaseInterceptor<BuildProps> {
  constructor(
    public readonly calculationId: string,
    public readonly fleetId: string,
    public readonly vehicleId: string,
  ) {
    super(
      `api/bonuses/branding-programs/calculations/${calculationId}?fleet_id=${fleetId}&vehicle_id=${vehicleId}`,
      'GET',
    );
  }

  protected ok(props?: BuildProps): InterceptorReturnType {
    return this.intercept({
      statusCode: 200,
      body: fleetFaker.brandingProgramsCalculationsList.buildDto(props),
    });
  }

  protected bad(): InterceptorReturnType {
    return this.intercept({
      statusCode: 400,
    });
  }
}
