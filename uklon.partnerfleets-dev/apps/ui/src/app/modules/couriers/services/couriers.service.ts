import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CourierHistoryChange, PhotoSize } from '@constant';
import {
  CollectionCursorDto,
  CourierDetailsDto,
  CourierHistoryChangeItemDto,
  CourierHistoryChangesDto,
  CourierHistoryParamsDto,
  CourierItemDto,
  CourierProductCollectionDto,
  CourierRestrictionListDto,
  CourierRestrictionRemoveDto,
  CourierRestrictionUpdateDto,
  CouriersQueryParamsDto,
  DateFilterDto,
  PhotosDto,
  ProductConfigurationUpdateItemCollectionDto,
  StatisticDetailsDto,
} from '@data-access';
import { HttpClientService } from '@ui/core/services/http-client.service';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CouriersService extends HttpClientService {
  constructor(private readonly http: HttpClient) {
    super();
  }

  public getFleetCouriers(
    fleetId: string,
    queryParams: CouriersQueryParamsDto,
  ): Observable<CollectionCursorDto<CourierItemDto>> {
    return this.http.get<CollectionCursorDto<CourierItemDto>>(`api/couriers/${fleetId}`, {
      params: {
        ...queryParams,
      },
    });
  }

  public getFleetCourierById(fleetId: string, courierId: string): Observable<CourierDetailsDto> {
    return this.http.get<CourierDetailsDto>(`api/couriers/${fleetId}/couriers/${courierId}`);
  }

  public removeFleetCourierById(fleetId: string, courierId: string): Observable<void> {
    return this.http.delete<void>(`api/couriers/${fleetId}/couriers/${courierId}`);
  }

  public getFleetCourierStatistics(
    fleetId: string,
    courierId: string,
    filter?: DateFilterDto,
  ): Observable<StatisticDetailsDto> {
    const params = this.createQueryParams(filter);
    return this.http.get<StatisticDetailsDto>(`api/couriers/${fleetId}/employees/${courierId}/statistic`, { params });
  }

  public getCourierHistory(courierId: string, query: CourierHistoryParamsDto): Observable<CourierHistoryChangesDto> {
    const params = new HttpParams({
      fromObject: query as unknown as Record<string, string | number>,
    });
    return this.http.get<CourierHistoryChangesDto>(`api/couriers/${courierId}/changes-history`, { params });
  }

  public getCourierHistoryInfo(
    courierId: string,
    changeType: CourierHistoryChange,
    eventId: string,
  ): Observable<CourierHistoryChangeItemDto> {
    return this.http.get<CourierHistoryChangeItemDto>(
      `api/couriers/${courierId}/changes-history/${changeType}/${eventId}`,
    );
  }

  public getCourierRestrictionsSettings(fleetId: string, courierId: string): Observable<CourierRestrictionListDto> {
    return this.http.get<CourierRestrictionListDto>(
      `api/couriers/${fleetId}/couriers/${courierId}/restrictions/settings`,
    );
  }

  public updateRestriction(fleetId: string, courierId: string, body: CourierRestrictionUpdateDto): Observable<void> {
    return this.http.put<void>(`api/couriers/${fleetId}/couriers/${courierId}/restrictions`, body);
  }

  public removeRestriction(fleetId: string, courierId: string, body: CourierRestrictionRemoveDto): Observable<void> {
    return this.http.delete<void>(`api/couriers/${fleetId}/couriers/${courierId}/restrictions`, {
      body,
    });
  }

  public getCourierRestrictions(fleetId: string, courierId: string): Observable<CourierRestrictionListDto> {
    return this.http.get<CourierRestrictionListDto>(`api/couriers/${fleetId}/couriers/${courierId}/restrictions`);
  }

  public getFleetCourierProducts(fleetId: string, courierId: string): Observable<CourierProductCollectionDto> {
    return this.http.get<CourierProductCollectionDto>(`api/couriers/${fleetId}/couriers/${courierId}/products`);
  }

  public updateFleetCourierProducts(
    fleetId: string,
    courierId: string,
    body: ProductConfigurationUpdateItemCollectionDto,
  ): Observable<void> {
    return this.http.put<void>(`api/couriers/${fleetId}/couriers/${courierId}/products`, body);
  }

  public getCourierPhotos(courierId: string, image_size: PhotoSize): Observable<PhotosDto> {
    return this.http.get<PhotosDto>(`api/couriers/${courierId}/images`, { params: { image_size } });
  }
}
