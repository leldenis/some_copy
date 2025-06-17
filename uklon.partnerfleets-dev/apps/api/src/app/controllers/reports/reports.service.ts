import { HttpControllerService } from '@api/common/http/http-controller.service';
import { mapSplits } from '@api/common/utils/splits-mapper';
import { FinanceService } from '@api/controllers/finance/finance.service';
import { reportMapper } from '@api/controllers/reports/utils/report-mapper';
import { PartnersService } from '@api/datasource';
import {
  CourierReportsQueryDto,
  DriversOrdersReportDto,
  InfinityScrollCollectionDto,
  ReportByOrdersCollectionDto,
  ReportByOrdersDto,
  ReportByOrdersQueryDto,
  VehicleOrderReportCollectionDto,
  VehicleOrderReportQueryDto,
} from '@data-access';
import { Injectable } from '@nestjs/common';
import { map, Observable, switchMap } from 'rxjs';

import { Jwt } from '@uklon/nest-core';

@Injectable()
export class ReportsService extends HttpControllerService {
  constructor(
    private readonly partnersService: PartnersService,
    private readonly financeService: FinanceService,
  ) {
    super();
  }

  public getFleetReportByOrders(
    token: Jwt,
    fleetId: string,
    params: ReportByOrdersQueryDto,
  ): Observable<InfinityScrollCollectionDto<DriversOrdersReportDto>> {
    return this.financeService.getFleetEntrepreneurs(token, fleetId, false).pipe(
      switchMap((entrepreneurs) => {
        return this.partnersService
          .get<ReportByOrdersCollectionDto>(`api/v2/fleets/${fleetId}/drivers/report-by-orders`, {
            token,
            params,
          })
          .pipe(
            map(({ has_more_items, items }) => {
              const mapped = items.map((item) => ({
                driver: item.driver,
                total_orders_count: item.total_orders_count,
                total_distance_meters: item.total_distance_meters,
                total_distance_to_pickup_meters: item.total_distance_to_pickup_meters,
                total_executing_time: item.total_executing_time,
                grouped_splits: mapSplits(entrepreneurs?.items, item?.split_payments),
                ...reportMapper(item),
                online_time_seconds: item.online_time_seconds || 0,
                chain_time_seconds: item.chain_time_seconds || 0,
                offer_time_seconds: item.offer_time_seconds || 0,
                broadcast_time_seconds: item.broadcast_time_seconds || 0,
                total_time_from_accepted_to_running: item.total_time_from_accepted_to_running || 0,
              }));

              return { has_more_items, items: mapped } as InfinityScrollCollectionDto<DriversOrdersReportDto>;
            }),
          );
      }),
    );
  }

  public getCouriersReports(
    token: Jwt,
    fleetId: string,
    params: CourierReportsQueryDto,
  ): Observable<InfinityScrollCollectionDto<ReportByOrdersDto>> {
    return this.partnersService.get(`/api/v1/finance-mediators/${fleetId}/couriers/report-by-orders`, {
      token,
      params,
    });
  }

  public getVehicleOrderReports(
    fleetId: string,
    query: VehicleOrderReportQueryDto,
    token: Jwt,
  ): Observable<VehicleOrderReportCollectionDto> {
    return this.partnersService.get(`api/v1/fleets/${fleetId}/vehicles/report-by-orders`, {
      token,
      params: {
        ...query,
        date_from: query.from,
        date_to: query.to,
      },
    });
  }
}
