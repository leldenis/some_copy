import { HttpControllerService } from '@api/common';
import { addBlockedByManagerStatus } from '@api/common/utils';
import { PartnersService } from '@api/datasource';
import { TicketStatus } from '@constant';
import {
  DriverPhotoControlQueryParamsDto,
  DriverPhotoControlTicketDto,
  DriverPhotoControlTicketsCollection,
  PhotoControlHasActiveTicketsDto,
} from '@data-access';
import { Injectable } from '@nestjs/common';
import { map, Observable } from 'rxjs';

import { Jwt } from '@uklon/nest-core';

@Injectable()
export class DriversPhotoControlService extends HttpControllerService {
  constructor(private readonly partnersService: PartnersService) {
    super();
  }

  public getDriversPhotoControlTickets(
    token: Jwt,
    fleetId: string,
    query: DriverPhotoControlQueryParamsDto,
  ): Observable<DriverPhotoControlTicketsCollection> {
    const params = addBlockedByManagerStatus<DriverPhotoControlQueryParamsDto>(query);

    return this.partnersService.get(`api/v1/fleets/${fleetId}/tickets/drivers/photo-control`, {
      token,
      params: {
        ...params,
        created_at_from: params.from,
        created_at_to: params.to,
      },
      paramsSerializer: {
        serialize: this.paramsSerializer,
      },
    });
  }

  public getDriversActivePhotoControlExist(token: Jwt, fleetId: string): Observable<PhotoControlHasActiveTicketsDto> {
    return this.partnersService
      .get(`api/v1/fleets/${fleetId}/tickets/drivers/photo-control`, {
        token,
        params: {
          status: [TicketStatus.DRAFT, TicketStatus.CLARIFICATION],
          limit: 1,
          cursor: -1,
        },
        paramsSerializer: {
          serialize: this.paramsSerializer,
        },
      })
      .pipe(map(({ items }) => ({ has_active_tickets: items.length > 0 })));
  }

  public getDriverPhotoControlTicket(token: Jwt, ticketId: string): Observable<DriverPhotoControlTicketDto> {
    return this.partnersService.get(`api/v1/tickets/driver-photo-control/${ticketId}`, { token });
  }
}
