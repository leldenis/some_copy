import { HttpControllerService } from '@api/common/http/http-controller.service';
import { AnalyticsReportingService } from '@api/datasource';
import { environment } from '@api-env/environment';
import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { getClientIp } from 'request-ip';
import { Observable } from 'rxjs';

import { AnalyticsEventEntity } from './entities/analytics-event.entity';

const REPORT_EVENTS_URL = 'api/v1/events/_bulk';

@Injectable()
export class AnalyticsService extends HttpControllerService {
  constructor(private readonly analyticsService: AnalyticsReportingService) {
    super();
  }

  public registerEvents(events: AnalyticsEventEntity[], request: Request): Observable<void> {
    const ip = getClientIp(request) || '';
    const analyticsEvents = events.map(({ custom_properties, ...rest }) => ({
      ...rest,
      custom_properties: { ...custom_properties, ip },
    }));

    return this.analyticsService.post(REPORT_EVENTS_URL, analyticsEvents, {
      headers: { client_id: environment.clientId },
    });
  }
}
