import { HttpControllerService } from '@api/common';
import { PartnersService } from '@api/datasource';
import { FleetContactDto, FleetUserNameByIdDto } from '@data-access';
import { Injectable } from '@nestjs/common';
import { map, Observable } from 'rxjs';

import { Jwt } from '@uklon/nest-core';

const FLEET_URL = 'api/v1/fleets';
const FLEET_CONTACTS_URL = `${FLEET_URL}/{0}`;

@Injectable()
export class ContactsService extends HttpControllerService {
  constructor(private readonly partnersService: PartnersService) {
    super();
  }

  public getFleetContacts(token: Jwt, fleetId: string): Observable<FleetContactDto[]> {
    return this.partnersService
      .get(this.buildUrl(FLEET_CONTACTS_URL, fleetId), { token })
      .pipe(map(({ users }) => users));
  }

  public getUserNamesById(token: Jwt, id: string[]): Observable<FleetUserNameByIdDto[]> {
    return this.partnersService.get<FleetUserNameByIdDto[]>('api/v1/users/names', {
      token,
      params: { id },
      paramsSerializer: this.paramsSerializer,
    });
  }
}
