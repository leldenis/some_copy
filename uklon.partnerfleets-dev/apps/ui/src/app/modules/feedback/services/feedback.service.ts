import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FleetCourierFeedbackDto, FleetDriverFeedbackDto, InfinityScrollCollectionDto } from '@data-access';
import { HttpClientService } from '@ui/core/services/http-client.service';
import { Observable } from 'rxjs';

import { CouriersFeedbackQueryParamsDto, DriversFeedbackQueryParamsDto } from '../models/feedback.dto';

@Injectable({ providedIn: 'root' })
export class FeedbackService extends HttpClientService {
  constructor(private readonly http: HttpClient) {
    super();
  }

  public getFeedbacks(
    fleetId: string,
    feedbackParams: DriversFeedbackQueryParamsDto,
  ): Observable<InfinityScrollCollectionDto<FleetDriverFeedbackDto>> {
    const params = new HttpParams({ fromObject: { ...feedbackParams } });

    return this.http.get<InfinityScrollCollectionDto<FleetDriverFeedbackDto>>(
      `api/fleets/${fleetId}/driver-feedbacks`,
      {
        params,
      },
    );
  }

  public getCouriersFeedbacks(
    fleetId: string,
    feedbackParams: CouriersFeedbackQueryParamsDto,
  ): Observable<InfinityScrollCollectionDto<FleetCourierFeedbackDto>> {
    const params = new HttpParams({ fromObject: { ...feedbackParams } });
    return this.http.get<InfinityScrollCollectionDto<FleetCourierFeedbackDto>>(`api/couriers/${fleetId}/feedbacks`, {
      params,
    });
  }
}
