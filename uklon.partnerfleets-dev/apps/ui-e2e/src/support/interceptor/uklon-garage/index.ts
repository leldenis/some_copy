import { fleetFaker } from '../../faker';
import { BuildProps } from '../../faker/modules/uklon-garage/list';
import { BaseInterceptor, InterceptorReturnType } from '../_internal';

export class UklonGarageApplicationsIntercept extends BaseInterceptor<BuildProps> {
  constructor(fleetId: string) {
    super(`api/uklon-garage/fleets/${fleetId}/applications*`);
  }

  protected ok(props?: BuildProps): InterceptorReturnType {
    return this.intercept({
      statusCode: 200,
      body: fleetFaker.uklonGarageApplicationsList.buildDto(props),
    });
  }

  protected bad(): InterceptorReturnType {
    return this.intercept({
      statusCode: 400,
    });
  }
}
