import { fleetFaker } from '../../faker';
import { BaseInterceptor, InterceptorReturnType } from '../_internal';

export class TicketConfigurationInterceptor extends BaseInterceptor<void> {
  constructor() {
    super(`/api/tickets/configuration?regionId=*`, 'GET');
  }

  protected ok(): InterceptorReturnType {
    return this.intercept({
      statusCode: 200,
      body: fleetFaker.ticketConfiguration.buildDto(),
    });
  }

  protected bad(): InterceptorReturnType {
    return this.intercept({
      statusCode: 400,
    });
  }
}
