import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  CourierReportsQueryDto,
  DriversOrdersReportDto,
  InfinityScrollCollectionDto,
  ReportByOrdersDto,
} from '@data-access';
import { HttpClientService, QueryParamsFilter } from '@ui/core/services/http-client.service';
import { OrderReportsParamsDto } from '@ui/modules/orders/models/order-reports.dto';
import { Observable } from 'rxjs';

import { toServerDate } from '@uklon/angular-core';

@Injectable({ providedIn: 'root' })
export class ReportsService extends HttpClientService {
  constructor(private readonly http: HttpClient) {
    super();
  }

  public findAllOrders(
    fleetId: string,
    params: OrderReportsParamsDto,
  ): Observable<InfinityScrollCollectionDto<DriversOrdersReportDto>> {
    const queryParams = this.createQueryParams({
      ...params,
      dateFrom: toServerDate(new Date(params.dateFrom)),
      dateTo: toServerDate(new Date(params.dateTo)),
    } as unknown as QueryParamsFilter);
    return this.http.get<InfinityScrollCollectionDto<DriversOrdersReportDto>>(
      `api/fleets/reports/${fleetId}/drivers-orders`,
      {
        params: queryParams,
      },
    );
  }

  public getCouriersOrderReport(
    fleetId: string,
    query: CourierReportsQueryDto,
  ): Observable<InfinityScrollCollectionDto<ReportByOrdersDto>> {
    const params = this.createQueryParams(query as unknown as QueryParamsFilter);
    return this.http.get<InfinityScrollCollectionDto<ReportByOrdersDto>>(
      `api/fleets/reports/${fleetId}/couriers-orders`,
      {
        params,
      },
    );
  }
}
