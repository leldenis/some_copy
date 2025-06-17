import { fleetFaker } from '../../../faker';
import { BuildProps } from '../../../faker/modules/finance/withdraw-to-card-settings';
import { BaseInterceptor, InterceptorReturnType } from '../../_internal';

export class WithdrawToCardSettingsIncept extends BaseInterceptor<BuildProps> {
  constructor(fleetId = '*') {
    super(`api/fleets/${fleetId}/finance/withdraw-to-card-settings/*`, 'GET');
  }

  protected ok(props?: BuildProps): InterceptorReturnType {
    return this.intercept({
      statusCode: 200,
      body: fleetFaker.withdrawToCardSettings.buildDto(props),
    });
  }

  protected bad(): InterceptorReturnType {
    return this.intercept({
      statusCode: 400,
    });
  }
}

export const withdrawToCardSettingsIncept = new WithdrawToCardSettingsIncept();
