import { HttpControllerService } from '@api/common';
import { SearchService, PartnersService, GpsService, RidersService } from '@api/datasource';
import {
  CouriersLiveMapDataDto,
  DriversLiveMapDataDto,
  Employee,
  FleetCityDataDto,
  LiveMapDataDto,
  LiveMapLocationDto,
  LocationPointDto,
  NearestLocationDto,
} from '@data-access';
import { Injectable } from '@nestjs/common';
import { catchError, map, Observable, of } from 'rxjs';

import { Jwt } from '@uklon/nest-core';

const NUM_OF_POINTS = 100_000;

@Injectable()
export class GeolocationService extends HttpControllerService {
  constructor(
    private readonly partnersService: PartnersService,
    private readonly searchService: SearchService,
    private readonly ridersService: RidersService,
    private readonly gpsService: GpsService,
  ) {
    super();
  }

  public getFleetDriversLocations(token: Jwt, fleetId: string): Observable<LiveMapDataDto> {
    return this.partnersService
      .get<DriversLiveMapDataDto>(`api/v1/fleets/${fleetId}/drivers/locations`, { token })
      .pipe(map(({ drivers, ...rest }) => ({ data: drivers, ...rest })));
  }

  public getAddressByGeolocation(
    latitude: number,
    longitude: number,
    locale: string,
    radius: number,
    count: number,
    token: Jwt,
  ): Observable<NearestLocationDto[]> {
    return this.searchService
      .get<{ details: NearestLocationDto[] }>(`api/v1/addresses/nearest`, {
        token,
        params: { latitude, longitude, radius, count, locale },
      })
      .pipe(
        map(({ details }) => details),
        catchError(() => of([])),
      );
  }

  public getGeolocationByRegionId(regionId: number, token: Jwt): Observable<LiveMapLocationDto> {
    return this.ridersService.get<FleetCityDataDto>(`api/v1/cities/${regionId}`, { token }).pipe(
      map(({ location: { lat, lng } }) => ({
        latitude: lat,
        longitude: lng,
      })),
    );
  }

  public getEmployeeLocationsInTimeframe(
    employeeId: string,
    from: number,
    to: number,
    employeeType: Employee,
    token: Jwt,
  ): Observable<LocationPointDto[]> {
    const employee = employeeType === Employee.COURIER ? 'courier-track' : 'driver-track';

    return this.gpsService
      .get(`api/v1/${employee}/${employeeId}`, {
        token,
        params: { from, to, limit: NUM_OF_POINTS },
      })
      .pipe(map(({ positions }) => positions));
  }

  public getFleetCouriersLocations(token: Jwt, fleetId: string): Observable<LiveMapDataDto> {
    return this.partnersService
      .get<CouriersLiveMapDataDto>(`api/v1/finance-mediators/${fleetId}/couriers/locations`, { token })
      .pipe(map(({ couriers, ...rest }) => ({ data: couriers, ...rest })));
  }
}
