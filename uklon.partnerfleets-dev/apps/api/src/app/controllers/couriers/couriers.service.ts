import { HttpControllerService, RequestConfig } from '@api/common';
import { PartnersService } from '@api/datasource';
import { CourierHistoryChange, PhotoSize } from '@constant';
import {
  CollectionCursorDto,
  CourierActivitySettingsDto,
  CourierDetailsDto,
  CourierHistoryChangeItemDto,
  CourierHistoryChangesDto,
  CourierItemDto,
  CourierProductCollectionDto,
  CourierRestrictionListDto,
  CourierRestrictionRemoveDto,
  CourierRestrictionUpdateDto,
  CursorPageRequestDto,
  DateFilterDto,
  FleetCourierFeedbackDto,
  FleetCourierNameByIdDto,
  InfinityScrollCollectionDto,
  PhotosDto,
  ProductConfigurationUpdateItemCollectionDto,
  some,
  StatisticDetailsDto,
} from '@data-access';
import { Injectable } from '@nestjs/common';
import { map, Observable } from 'rxjs';

import { Jwt } from '@uklon/nest-core';

@Injectable()
export class CouriersService extends HttpControllerService {
  constructor(private readonly partnersService: PartnersService) {
    super();
  }

  public getFleetCouriers(
    token: Jwt,
    fleetId: string,
    name: string,
    phone: string,
    page: CursorPageRequestDto,
  ): Observable<CollectionCursorDto<CourierItemDto>> {
    return this.partnersService.get(`api/v1/finance-mediators/${fleetId}/couriers`, {
      token,
      params: {
        name,
        phone,
        ...page,
      },
    });
  }

  public getFleetCourierById(token: Jwt, fleetId: string, courierId: string): Observable<CourierDetailsDto> {
    return this.partnersService.get(`api/v1/finance-mediators/${fleetId}/couriers/${courierId}`, { token });
  }

  public removeFleetCourierById(token: Jwt, fleetId: string, courierId: string): Observable<void> {
    return this.partnersService.delete<void>(`api/v1/finance-mediators/${fleetId}/couriers/${courierId}`, { token });
  }

  public getFleetCourierStatistic(
    token: Jwt,
    fleetId: string,
    courierId: string,
    params?: DateFilterDto,
  ): Observable<StatisticDetailsDto> {
    const config: RequestConfig = {
      token,
      params,
      paramsSerializer: {
        serialize: this.paramsSerializer,
      },
    };
    return this.partnersService
      .get(`api/v1/finance-mediators/${fleetId}/employees/${courierId}/statistic`, config)
      .pipe(
        /**
         * If some data is not empty we should pass the response as is
         * but if all properties are empty then we pass an empty response.
         */
        map((data) => (some(data, (prop) => !!prop) ? data : null)),
      );
  }

  public getFleetCourierHistory(
    token: Jwt,
    courierId: string,
    fleetId: string,
    changeType: string,
    page: CursorPageRequestDto,
  ): Observable<CourierHistoryChangesDto> {
    const config: RequestConfig = {
      token,
      params: {
        fleet_id: fleetId,
        change_type: changeType,
        cursor: page.cursor,
        limit: page.limit,
      },
      paramsSerializer: {
        serialize: this.paramsSerializer,
      },
    };

    return this.partnersService.get(`api/v1/couriers/${courierId}/changes-history`, config);
  }

  public getFleetCourierHistoryChangeInfo(
    token: Jwt,
    courierId: string,
    changeType: CourierHistoryChange,
    eventId: string,
  ): Observable<CourierHistoryChangeItemDto> {
    return this.partnersService.get<CourierHistoryChangeItemDto>(
      `api/v1/couriers/${courierId}/changes-history/${changeType}/${eventId}`,
      { token },
    );
  }

  public getCouriersNamesByIds(token: Jwt, id: string[]): Observable<FleetCourierNameByIdDto[]> {
    return this.partnersService.get<FleetCourierNameByIdDto[]>('api/v1/couriers/names', {
      token,
      params: { id },
      paramsSerializer: {
        serialize: this.paramsSerializer,
      },
    });
  }

  public getFleetCourierRestrictionsSettings(
    token: Jwt,
    fleetId: string,
    courierId: string,
  ): Observable<CourierRestrictionListDto> {
    return this.partnersService.get(`api/v1/finance-mediators/${fleetId}/couriers/${courierId}/restrictions/settings`, {
      token,
    });
  }

  public updateFleetCourierRestriction(
    token: Jwt,
    fleetId: string,
    courierId: string,
    body: CourierRestrictionUpdateDto,
  ): Observable<void> {
    return this.partnersService.put(`api/v1/finance-mediators/${fleetId}/couriers/${courierId}/restrictions`, body, {
      token,
    });
  }

  public removeFleetCourierRestriction(
    token: Jwt,
    fleetId: string,
    courierId: string,
    data: CourierRestrictionRemoveDto,
  ): Observable<void> {
    return this.partnersService.delete(`api/v1/finance-mediators/${fleetId}/couriers/${courierId}/restrictions`, {
      token,
      data,
    });
  }

  public getFleetCourierRestrictions(
    token: Jwt,
    fleetId: string,
    courierId: string,
  ): Observable<CourierRestrictionListDto> {
    return this.partnersService.get(`api/v1/finance-mediators/${fleetId}/couriers/${courierId}/restrictions`, {
      token,
    });
  }

  public getFleetCourierProducts(
    token: Jwt,
    fleetId: string,
    courierId: string,
  ): Observable<CourierProductCollectionDto> {
    return this.partnersService.get<CourierProductCollectionDto>(
      `api/v1/finance-mediators/${fleetId}/couriers/${courierId}/products`,
      { token },
    );
  }

  public updateFleetCourierProducts(
    token: Jwt,
    fleetId: string,
    courierId: string,
    body: ProductConfigurationUpdateItemCollectionDto,
  ): Observable<void> {
    return this.partnersService.put<void>(`api/v1/finance-mediators/${fleetId}/couriers/${courierId}/products`, body, {
      token,
    });
  }

  public getCourierPhotos(token: Jwt, courierId: string, image_size: PhotoSize): Observable<PhotosDto> {
    return this.partnersService.get<PhotosDto>(`api/v1/couriers/${courierId}/images`, {
      token,
      params: { image_size },
    });
  }

  public getFeedbacks(
    token: Jwt,
    fleetId: string,
    limit: number,
    offset: number,
    created_at_from: number,
    created_at_to: number,
    courier_id: string,
  ): Observable<InfinityScrollCollectionDto<FleetCourierFeedbackDto>> {
    return this.partnersService.get(`api/v1/finance-mediator/${fleetId}/couriers/feedbacks`, {
      token,
      params: {
        limit,
        offset,
        created_at_from,
        created_at_to,
        courier_id,
      },
    });
  }

  public getCourierActivitySettings(token: Jwt, regionId: number): Observable<CourierActivitySettingsDto> {
    return this.partnersService
      .get<CourierActivitySettingsDto>(`api/v1/regions/${regionId}/settings/activity-rate`, { token })
      .pipe(map(({ is_active, activated_at }) => ({ is_active, activated_at })));
  }
}
