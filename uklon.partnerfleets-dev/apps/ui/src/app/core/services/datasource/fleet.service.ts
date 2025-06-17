import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  CollectionCursorDto,
  FleetDetailsDto,
  FleetHistoryChangeItemDto,
  FleetHistoryRequestParamsDto,
  FleetHistoryType,
  RegionDto,
} from '@data-access';
import { Observable } from 'rxjs';

import { HttpClientService } from '../http-client.service';

const FLEET_URL = 'api/fleets';
const KARMA_REFERENCE_URL = `${FLEET_URL}/region/{0}`;

@Injectable({ providedIn: 'root' })
export class FleetService extends HttpClientService {
  constructor(private readonly http: HttpClient) {
    super();
  }

  public getRegion(regionId: string): Observable<RegionDto> {
    return this.http.get<RegionDto>(this.buildUrl(KARMA_REFERENCE_URL, regionId));
  }

  public getFleetById(fleetId: string): Observable<FleetDetailsDto> {
    return this.http.get<FleetDetailsDto>(`api/fleets/${fleetId}`);
  }

  public getFleetHistory(
    fleetId: string,
    queryParams: FleetHistoryRequestParamsDto,
  ): Observable<CollectionCursorDto<FleetHistoryChangeItemDto>> {
    const params = new HttpParams({ fromObject: { ...queryParams } });
    return this.http.get<CollectionCursorDto<FleetHistoryChangeItemDto>>(`api/fleets/${fleetId}/history`, { params });
  }

  public getFleetHistoryAdditionalInfo(
    fleetId: string,
    changeType: FleetHistoryType,
    changeId: string,
  ): Observable<FleetHistoryChangeItemDto> {
    return this.http.get<FleetHistoryChangeItemDto>(`api/fleets/${fleetId}/history/${changeType}/${changeId}`);
  }
}
