import { fleetFaker } from '../../../faker';
import { BuildProps } from '../../../faker/modules/drivers';
import { BaseInterceptor, InterceptorReturnType } from '../../_internal';

export class FleetDriverListIntercept extends BaseInterceptor<BuildProps> {
  constructor(fleetId: string) {
    super(`api/fleets/${fleetId}/drivers*`, 'GET');
  }

  protected ok<T>(props?: BuildProps): InterceptorReturnType<T> {
    return this.intercept({
      statusCode: 200,
      body: fleetFaker.driverCollection.buildDto(props),
    });
  }

  protected bad<T>(): InterceptorReturnType<T> {
    return this.intercept({
      statusCode: 400,
    });
  }
}

export const fleetDriverListIntercept = new FleetDriverListIntercept('*');
