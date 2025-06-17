import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { VehicleOrderReportCollectionDto, VehicleOrderReportQueryDto } from '@data-access';
import { HttpClientService } from '@ui/core/services/http-client.service';
import { omitBy } from 'lodash';
import { Observable } from 'rxjs';

import { toServerDate } from '@uklon/angular-core';

@Injectable({ providedIn: 'root' })
export class VehicleOrderReportsService extends HttpClientService {
  constructor(private readonly http: HttpClient) {
    super();
  }

  public getVehicleOrderReports(
    fleetId: string,
    { from, to, vehicle_id, cursor, limit }: VehicleOrderReportQueryDto,
  ): Observable<VehicleOrderReportCollectionDto> {
    const params = omitBy(
      {
        from: toServerDate(new Date(from)),
        to: toServerDate(new Date(to)),
        vehicle_id,
        cursor,
        limit,
      },
      (value) => value === '',
    );

    return this.http.get<VehicleOrderReportCollectionDto>(`api/fleets/reports/${fleetId}/vehicles/report-by-orders`, {
      params,
    });
  }
}
