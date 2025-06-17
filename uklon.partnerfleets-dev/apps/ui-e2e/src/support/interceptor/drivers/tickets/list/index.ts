import { fleetFaker } from '../../../../faker';
import { BuildProps } from '../../../../faker/modules/drivers/tickets/list';
import { BaseInterceptor, InterceptorReturnType } from '../../../_internal';

export class FleetDriverTicketsListIntercept extends BaseInterceptor<BuildProps> {
  constructor(fleetId: string, query: string) {
    super(`api/fleets/${fleetId}/driver-tickets?${query}`, 'GET');
  }

  protected ok(props?: BuildProps): InterceptorReturnType {
    return this.intercept({
      statusCode: 200,
      body: fleetFaker.driverTicketsList.buildDto(props),
    });
  }

  protected bad(): InterceptorReturnType {
    return this.intercept({
      statusCode: 400,
    });
  }
}

export const fleetDriverRideConditionsIntercept = new FleetDriverTicketsListIntercept('*', '*');
