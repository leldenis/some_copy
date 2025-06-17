import { fleetFaker } from '../../../faker';
import { BuildProps } from '../../../faker/modules/finance/fleet-wallet';
import { BaseInterceptor, InterceptorReturnType } from '../../_internal';

export class FleetWalletIntercept extends BaseInterceptor<BuildProps> {
  constructor(fleetId = '*') {
    super(`api/fleets/${fleetId}/finance/wallet`, 'GET');
  }

  protected ok(props?: BuildProps): InterceptorReturnType {
    return this.intercept({
      statusCode: 200,
      body: fleetFaker.fleetWallet.buildDto(props),
    });
  }

  protected bad(): InterceptorReturnType {
    return this.intercept({
      statusCode: 400,
    });
  }
}

export const fleetWalletIntercept = new FleetWalletIntercept();
