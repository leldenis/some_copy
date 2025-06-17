import { fleetFaker } from '../../../faker';
import { BuildProps } from '../../../faker/modules/finance/cash-limits';
import { BaseInterceptor, InterceptorReturnType } from '../../_internal';

export class CashLimitsSettingsIntercept extends BaseInterceptor<BuildProps> {
  constructor(fleetId: string = '*') {
    super(`api/fleets/${fleetId}/finance/cash-limits`);
  }

  protected ok(props?: BuildProps): InterceptorReturnType {
    return this.intercept({
      statusCode: 200,
      body: fleetFaker.cashLimitsSettings.buildDto(props),
    });
  }

  protected bad(): InterceptorReturnType {
    return this.intercept({
      statusCode: 400,
    });
  }
}
