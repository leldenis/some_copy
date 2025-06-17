import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TicketStatus } from '@constant';
import {
  DriverPhotoControlQueryParamsDto,
  DriverPhotoControlTicketDto,
  DriverPhotoControlTicketsCollection,
  PhotoControlHasActiveTicketsDto,
} from '@data-access';
import { HttpClientService } from '@ui/core/services/http-client.service';
import { omitBy } from 'lodash';
import { map, Observable } from 'rxjs';

import { toServerDate } from '@uklon/angular-core';

@Injectable({ providedIn: 'root' })
export class DriverPhotoControlService extends HttpClientService {
  constructor(private readonly http: HttpClient) {
    super();
  }

  public getDriversPhotoControlTickets(
    fleetId: string,
    { status, phone, cursor, limit, from, to }: DriverPhotoControlQueryParamsDto,
  ): Observable<DriverPhotoControlTicketsCollection> {
    const params = omitBy(
      {
        ...(status && status !== TicketStatus.ALL && { status }),
        phone,
        cursor,
        limit,
        from: toServerDate(new Date(from)),
        to: toServerDate(new Date(to)),
      },
      (value) => value === '',
    );

    return this.http.get<DriverPhotoControlTicketsCollection>(`api/fleets/${fleetId}/drivers-photo-control-tickets`, {
      params,
    });
  }

  public getDriversActivePhotoControlExist(fleetId: string): Observable<boolean> {
    return this.http
      .get<PhotoControlHasActiveTicketsDto>(`api/fleets/${fleetId}/drivers/driver-photo-control/has-active-tickets`)
      .pipe(map(({ has_active_tickets }) => has_active_tickets));
  }

  public getDriverPhotoControlTicket(ticketId: string): Observable<DriverPhotoControlTicketDto> {
    return this.http.get<DriverPhotoControlTicketDto>(`api/fleets/driver-photo-control/${ticketId}`);
  }

  public sendDriverPhotoControlTicket(ticketId: string): Observable<void> {
    return this.http.post<void>(`api/tickets/${ticketId}/driver-photo-control/send`, {});
  }
}
