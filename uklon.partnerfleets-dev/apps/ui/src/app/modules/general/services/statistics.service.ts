import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DashboardStatisticsDto, getCurrentWeek } from '@data-access';
import { HttpClientService } from '@ui/core/services/http-client.service';
import { catchError, Observable, of } from 'rxjs';

const DEFAULT_PERIOD = getCurrentWeek();
const STATISTICS_URL = 'api/statistics/{0}/dashboard';

@Injectable({ providedIn: 'root' })
export class StatisticsService extends HttpClientService {
  constructor(private readonly http: HttpClient) {
    super();
  }

  public getDashboardStatistics(
    fleetId: string,
    dateFrom: number = Math.floor(DEFAULT_PERIOD.from / 1000),
    dateTo: number = Math.floor(DEFAULT_PERIOD.to / 1000),
  ): Observable<DashboardStatisticsDto> {
    const params = new HttpParams().append('dateFrom', dateFrom).append('dateTo', dateTo);

    return this.http
      .get<DashboardStatisticsDto>(this.buildUrl(STATISTICS_URL, fleetId), { params })
      .pipe(catchError(() => of(null)));
  }
}
