import { fleetFaker } from '../../../faker';
import { BuildProps } from '../../../faker/modules/finance/individual-entrepreneurs';
import { BaseInterceptor, InterceptorReturnType } from '../../_internal';

export class IndividualEntrepreneursIntercept extends BaseInterceptor<BuildProps> {
  constructor(fleetId: string, includeWithdrawalType: boolean) {
    super(
      `api/fleets/${fleetId}/finance/individual-entrepreneurs?includeWithdrawalType=${includeWithdrawalType}`,
      'GET',
    );
  }

  protected ok(props?: BuildProps): InterceptorReturnType {
    return this.intercept({
      statusCode: 200,
      body: fleetFaker.individualEntrepreneurs.buildDto(props),
    });
  }

  protected bad(): InterceptorReturnType {
    return this.intercept({
      statusCode: 400,
    });
  }
}
