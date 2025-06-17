import { fleetFaker } from '../../faker';
import { BuildProps } from '../../faker/modules/feedbacks';
import { BaseInterceptor, InterceptorReturnType } from '../_internal';

export class DriverFeedbacksIntercept extends BaseInterceptor<unknown> {
  constructor(fleetId: string) {
    super(`api/fleets/${fleetId}/driver-feedbacks*`, 'GET');
  }

  protected ok(props?: BuildProps): InterceptorReturnType {
    return this.intercept({
      statusCode: 200,
      body: fleetFaker.driverFeedbacks.buildDto(props),
    });
  }

  protected bad(): InterceptorReturnType {
    return this.intercept({
      statusCode: 400,
    });
  }
}
