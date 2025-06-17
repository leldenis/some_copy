import { fleetFaker } from '../../../faker';
import { BuildProps } from '../../../faker/modules/finance/employees-wallet';
import { BaseInterceptor, InterceptorReturnType } from '../../_internal';

export class FleetEmployeesWalletIntercept extends BaseInterceptor<BuildProps> {
  constructor(fleetId: string, driverId: string) {
    super(`api/fleets/${fleetId}/finance/employees/${driverId}/wallet`, 'GET');
  }

  protected ok(props?: BuildProps): InterceptorReturnType {
    return this.intercept({
      statusCode: 200,
      body: fleetFaker.fleetEmployeesWallet.buildDto(props),
    });
  }

  protected bad(): InterceptorReturnType {
    return this.intercept({
      statusCode: 400,
    });
  }
}
