import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NearestLocationDto, LiveMapLocationDto, LiveMapDataDto, LocationPointDto, Employee } from '@data-access';
import { HttpClientService } from '@ui/core/services/http-client.service';
import { Observable, of, map, tap, catchError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class GeolocationService extends HttpClientService {
  private readonly geolocationMemo = new Map<string, NearestLocationDto>();
  private readonly regionLocationMemo = new Map<number, LiveMapLocationDto>();

  constructor(private readonly http: HttpClient) {
    super();
  }

  public getDriversLocations(fleetId: string): Observable<LiveMapDataDto> {
    return this.http
      .get<LiveMapDataDto>(this.buildUrl('api/geolocation/{0}/drivers', fleetId))
      .pipe(catchError(() => of({ actual_on: Date.now(), data: [], cache_time_to_live: Number.POSITIVE_INFINITY })));
  }

  public getAddress(lat: number, lng: number, locale: string): Observable<NearestLocationDto> {
    const params = new HttpParams({ fromObject: { lat, lng, locale } });
    const key = `${lat},${lng},${locale}`;

    if (this.geolocationMemo.has(key)) {
      return of(this.geolocationMemo.get(key));
    }

    return this.http.get<NearestLocationDto[]>(this.buildUrl('api/geolocation/address'), { params }).pipe(
      map(([location]) => location),
      tap((location) => this.geolocationMemo.set(key, location)),
      catchError(() => of({} as NearestLocationDto)),
    );
  }

  public getLocationByRegionId(regionId: number): Observable<LiveMapLocationDto> {
    const params = new HttpParams().append('regionId', regionId);

    if (this.regionLocationMemo.has(regionId)) {
      return of(this.regionLocationMemo.get(regionId));
    }

    return this.http.get<LiveMapLocationDto>(this.buildUrl('api/geolocation/by-region-id'), { params }).pipe(
      tap((location) => this.regionLocationMemo.set(regionId, location)),
      catchError(() => of({ latitude: 0, longitude: 0 })),
    );
  }

  public getEmployeeLocationInTimeframe(
    employeeId: string,
    from: number,
    to: number,
    employeeType: Employee = Employee.DRIVER,
  ): Observable<LocationPointDto[]> {
    const params = new HttpParams({ fromObject: { from, to, employeeType } });

    return this.http
      .get<LocationPointDto[]>(this.buildUrl(`api/geolocation/employee/{0}/timeframe`, employeeId), { params })
      .pipe(catchError(() => of([])));
  }

  public getCouriersLocations(fleetId: string): Observable<LiveMapDataDto> {
    return this.http
      .get<LiveMapDataDto>(this.buildUrl('api/geolocation/{0}/couriers', fleetId))
      .pipe(catchError(() => of({ actual_on: Date.now(), data: [], cache_time_to_live: Number.POSITIVE_INFINITY })));
  }
}
