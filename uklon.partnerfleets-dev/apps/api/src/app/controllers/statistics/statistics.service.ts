import { HttpControllerService } from '@api/common';
import { PartnersService } from '@api/datasource';
import { DashboardStatisticsDto } from '@data-access';
import { Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';

import { Jwt } from '@uklon/nest-core';

const FLEET_URL = 'api/v1/fleets/{0}';
const DASHBOARD_STATISTICS_URL = `${FLEET_URL}/dashboard`;

@Injectable()
export class StatisticsService extends HttpControllerService {
  constructor(private readonly partnersService: PartnersService) {
    super();
  }

  public getDashboardStatistics(
    token: Jwt,
    fleetId: string,
    date_from: string,
    date_to: string,
  ): Observable<DashboardStatisticsDto> {
    return this.partnersService.get(this.buildUrl(DASHBOARD_STATISTICS_URL, fleetId), {
      token,
      params: { date_from, date_to },
    });
  }
}
