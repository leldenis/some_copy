import { fleetFaker } from '../../../faker';
import { BuildProps } from '../../../faker/modules/vehicle/tickets-list';
import { BaseInterceptor, InterceptorReturnType } from '../../_internal';

export class FleetVehiclesTicketsListIntercept extends BaseInterceptor<BuildProps> {
  constructor(fleetId: string, query: string) {
    super(`api/tickets/fleets/${fleetId}?${query}`, 'GET');
  }

  protected ok(props?: BuildProps): InterceptorReturnType {
    return this.intercept({
      statusCode: 200,
      body: fleetFaker.fleetVehiclesTicketsList.buildDto(props),
    });
  }

  protected bad(): InterceptorReturnType {
    return this.intercept({
      statusCode: 400,
    });
  }
}
