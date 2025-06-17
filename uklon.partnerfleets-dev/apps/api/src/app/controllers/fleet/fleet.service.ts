import { HttpControllerService } from '@api/common';
import { PartnersService } from '@api/datasource';
import {
  CollectionCursorDto,
  FleetDetailsDto,
  FleetHistoryChangeItemDto,
  FleetHistoryRequestParamsDto,
  FleetHistoryType,
  VehicleBasicInfoCollection,
} from '@data-access';
import { Injectable } from '@nestjs/common';
import { map, Observable, of, switchMap } from 'rxjs';

import { Jwt } from '@uklon/nest-core';

import { ContactsService } from '../contacts/contacts.service';
import { DriversService } from '../drivers/drivers.service';
import { VehiclesService } from '../vehicles/vehicles.service';

const VEHICLE_CHANGES = new Set<FleetHistoryType>([
  FleetHistoryType.VEHICLE_ADDED,
  FleetHistoryType.VEHICLE_REGISTERED,
  FleetHistoryType.VEHICLE_REMOVED,
]);

const DRIVER_CHANGES = new Set<FleetHistoryType>([
  FleetHistoryType.DRIVER_ADDED,
  FleetHistoryType.DRIVER_REGISTERED,
  FleetHistoryType.DRIVER_REMOVED,
]);

const CONTACTS_CHANGES = new Set<FleetHistoryType>([
  FleetHistoryType.MANAGER_ADDED,
  FleetHistoryType.MANAGER_DELETED,
  FleetHistoryType.OWNER_ADDED,
  FleetHistoryType.OWNER_DELETED,
]);

@Injectable()
export class FleetService extends HttpControllerService {
  constructor(
    private readonly partnersService: PartnersService,
    private readonly vehiclesService: VehiclesService,
    private readonly driversService: DriversService,
    private readonly contactsService: ContactsService,
  ) {
    super();
  }

  public getFleetById(token: Jwt, fleetId: string): Observable<FleetDetailsDto> {
    return this.partnersService.get(`api/v1/fleets/${fleetId}`, { token });
  }

  public getFleetHistory(
    token: Jwt,
    fleetId: string,
    { cursor, limit, changeType }: FleetHistoryRequestParamsDto,
  ): Observable<CollectionCursorDto<FleetHistoryChangeItemDto>> {
    return this.partnersService.get(`api/v1/fleets/${fleetId}/changes-history`, {
      token,
      params: {
        limit,
        cursor,
        change_type: changeType,
      },
    });
  }

  public getFleetHistoryAdditionalInfo(
    token: Jwt,
    fleetId: string,
    changeType: FleetHistoryType,
    changeId: string,
  ): Observable<FleetHistoryChangeItemDto> {
    return this.partnersService
      .get<FleetHistoryChangeItemDto>(`api/v1/fleets/${fleetId}/changes-history/${changeType}/${changeId}`, { token })
      .pipe(switchMap((info) => this.getDetails(token, info, changeType)));
  }

  private getDetails(
    token: Jwt,
    info: FleetHistoryChangeItemDto,
    changeType: FleetHistoryType,
  ): Observable<FleetHistoryChangeItemDto> {
    if (VEHICLE_CHANGES.has(changeType)) {
      return this.vehiclesService.getFleetVehicleBasicInfo(token, [info.linked_entities.vehicle_id as string]).pipe(
        map((collection: VehicleBasicInfoCollection) => collection?.items || []),
        switchMap(([vehicle]) => of({ ...info, details: { vehicle } })),
      );
    }

    if (DRIVER_CHANGES.has(changeType)) {
      return this.driversService
        .getDriverBasicInfo(token, [info.linked_entities.driver_id as string])
        .pipe(switchMap(([driver]) => of({ ...info, details: { driver } })));
    }

    if (CONTACTS_CHANGES.has(changeType)) {
      return this.contactsService
        .getUserNamesById(token, [info.linked_entities.user_id as string])
        .pipe(switchMap(([user]) => of({ ...info, details: { user } })));
    }

    return of(info);
  }
}
