import { fleetFaker } from '../../../faker';
import { BuildProps } from '../../../faker/modules/finance/drivers-wallets';
import { BaseInterceptor, InterceptorReturnType } from '../../_internal';

export class FleetDriversWalletsIntercept extends BaseInterceptor<BuildProps> {
  constructor(fleetId: string) {
    super(`api/fleets/${fleetId}/finance/drivers/wallets`, 'GET');
  }

  protected ok(props?: BuildProps): InterceptorReturnType {
    return this.intercept({
      statusCode: 200,
      body: fleetFaker.fleetDriversWallets.buildDto(props),
    });
  }

  protected bad(): InterceptorReturnType {
    return this.intercept({
      statusCode: 400,
    });
  }
}
