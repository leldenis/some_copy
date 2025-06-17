import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { DRIVER_EXCLUDED_PRODUCTS, PhotoSize, TicketStatus } from '@constant';
import {
  CollectionCursorDto,
  DateFilterDto,
  DriverAccessibilityRulesMetricsDto,
  DriverDenyListDto,
  DriverFinanceProfileDto,
  DriverHistoryChange,
  DriverHistoryChangeItemDto,
  DriverHistoryChangesDto,
  DriverHistoryParamsDto,
  DriverProductConfigurationsCollectionDto,
  DriverRestrictionListDto,
  DriverRideConditionListDto,
  StatisticDetailsDto,
  DriverVehicleAccessSettingsDto,
  DriverVehicleAccessSettingUpdateItemDto,
  FleetDriverDto,
  FleetDriverBasicInfoDto,
  FleetDriverRegistrationTicketDto,
  FleetDriverRestrictionDeleteDto,
  FleetDriverRestrictionUpdateDto,
  FleetDriversItemDto,
  PaginationCollectionDto,
  PhotosDto,
  ProductConfigurationUpdateItemCollectionDto,
  RemoveReasonDto,
  SetDriverProductConfigurationDto,
  UpdateDriverFinanceProfileDto,
  DriversQueryParamsDto,
  DriversByCashLimitQueryParamsDto,
  DriverByCashLimitDto,
  RemoveCashLimitRestrictionWithResetDto,
  DriverOrderFiltersCollectionDto,
  CursorPageRequestDto,
  InfinityPageRequestDto,
} from '@data-access';
import { HttpClientService } from '@ui/core/services/http-client.service';
import { LoadingIndicatorService } from '@ui/core/services/loading-indicator.service';
import { removeEmptyParams } from '@ui/shared';
import { catchError, finalize, map, Observable, of } from 'rxjs';

import { Region } from '@uklon/types';

@Injectable({ providedIn: 'root' })
export class DriverService extends HttpClientService {
  private readonly loaderService = inject(LoadingIndicatorService);

  constructor(private readonly http: HttpClient) {
    super();
  }

  public getFleetDrivers(
    fleetId: string,
    query: DriversQueryParamsDto,
    limit = 30,
    offset = 0,
    regionId?: number,
  ): Observable<PaginationCollectionDto<FleetDriversItemDto>> {
    const params = removeEmptyParams({
      limit,
      offset,
      ...query,
      ...(regionId && { region_id: regionId }),
    });

    return this.http.get<PaginationCollectionDto<FleetDriversItemDto>>(`api/fleets/${fleetId}/drivers`, {
      params,
    });
  }

  public getDrivers(
    fleetId: string,
    page: InfinityPageRequestDto,
  ): Observable<PaginationCollectionDto<FleetDriversItemDto>> {
    return this.http.get<PaginationCollectionDto<FleetDriversItemDto>>(`api/fleets/${fleetId}/drivers`, {
      params: new HttpParams({
        fromObject: { limit: page.limit, offset: page.offset },
      }),
    });
  }

  public getDriverRideCondition(fleetId: string, driverId: string): Observable<DriverRideConditionListDto> {
    return this.http.get<DriverRideConditionListDto>(`api/fleets/${fleetId}/drivers/${driverId}/ride-conditions`);
  }

  public getFleetDriverById(fleetId: string, driverId: string): Observable<FleetDriverDto> {
    return this.http.get<FleetDriverDto>(`api/fleets/${fleetId}/drivers/${driverId}`);
  }

  public getFleetDriverPhotos(driverId: string, image_size: PhotoSize): Observable<PhotosDto> {
    return this.http.get<PhotosDto>(`api/fleets/drivers/${driverId}/images`, {
      params: { image_size },
    });
  }

  public removeFleetDriverById(fleetId: string, driverId: string, body: RemoveReasonDto): Observable<void> {
    return this.http.delete<void>(`api/fleets/${fleetId}/drivers/${driverId}`, { body });
  }

  public getFleetDriverProductsConfigurations(
    fleetId: string,
    driverId: string,
  ): Observable<DriverProductConfigurationsCollectionDto> {
    return this.http
      .get<DriverProductConfigurationsCollectionDto>(
        `api/fleets/${fleetId}/drivers/${driverId}/products/configurations`,
      )
      .pipe(
        // done by ticket PF-1315 PF-1689
        map((data) => ({ items: data.items.filter(({ product: { code } }) => !DRIVER_EXCLUDED_PRODUCTS.has(code)) })),
      );
  }

  public updateFleetDriverProductConfigurations(
    fleetId: string,
    driverId: string,
    body: ProductConfigurationUpdateItemCollectionDto,
  ): Observable<void> {
    return this.http.put<void>(`api/fleets/${fleetId}/drivers/${driverId}/products/configurations`, body);
  }

  public updateFleetDriverProductConfigurationsById(
    fleetId: string,
    driverId: string,
    productId: string,
    body: SetDriverProductConfigurationDto,
  ): Observable<void> {
    return this.http.put<void>(`api/fleets/${fleetId}/drivers/${driverId}/products/${productId}/configurations`, body);
  }

  public getRestrictions(fleetId: string, driverId: string): Observable<DriverRestrictionListDto> {
    return this.http.get<DriverRestrictionListDto>(`api/fleets/${fleetId}/drivers/${driverId}/restrictions`);
  }

  public getRestrictionsSettings(fleetId: string, driverId: string): Observable<DriverRestrictionListDto> {
    return this.http.get<DriverRestrictionListDto>(`api/fleets/${fleetId}/drivers/${driverId}/restrictions/settings`);
  }

  public setRestriction(fleetId: string, driverId: string, body: FleetDriverRestrictionUpdateDto): Observable<unknown> {
    return this.http.put<DriverRestrictionListDto>(`api/fleets/${fleetId}/drivers/${driverId}/restrictions`, body);
  }

  public delRestriction(fleetId: string, driverId: string, body: FleetDriverRestrictionDeleteDto): Observable<unknown> {
    return this.http.delete<DriverRestrictionListDto>(`api/fleets/${fleetId}/drivers/${driverId}/restrictions`, {
      body,
    });
  }

  public getFinanceProfile(fleetId: string, driverId: string): Observable<DriverFinanceProfileDto> {
    return this.http.get<DriverFinanceProfileDto>(`api/fleets/${fleetId}/drivers/${driverId}/finance-profile`);
  }

  public setFinanceProfile(
    fleetId: string,
    driverId: string,
    model: UpdateDriverFinanceProfileDto,
  ): Observable<DriverFinanceProfileDto> {
    return this.http.put<DriverFinanceProfileDto>(`api/fleets/${fleetId}/drivers/${driverId}/finance-profile`, model);
  }

  public getTickets(
    fleetId: string,
    page: CursorPageRequestDto,
    filter?: { phone: string; status: TicketStatus | string },
  ): Observable<CollectionCursorDto<FleetDriverRegistrationTicketDto>> {
    let params = new HttpParams({ fromObject: { limit: page.limit } });

    if (page?.cursor) {
      params = params.set('cursor', page.cursor);
    }

    if (filter?.phone) {
      params = params.set('phone', filter.phone);
    }

    if (filter?.status) {
      params = params.set('status', filter.status);
    }

    return this.http.get<CollectionCursorDto<FleetDriverRegistrationTicketDto>>(
      `api/fleets/${fleetId}/driver-tickets`,
      { params },
    );
  }

  public getFleetDriverStatistics(
    fleetId: string,
    driverId: string,
    filter?: DateFilterDto,
  ): Observable<StatisticDetailsDto> {
    const params = this.createQueryParams(filter);
    return this.http.get<StatisticDetailsDto>(`api/fleets/${fleetId}/drivers/${driverId}/statistic`, { params });
  }

  public getDriverAccessibilityRulesMetrics(
    fleetId: string,
    driverId: string,
  ): Observable<DriverAccessibilityRulesMetricsDto> {
    return this.http.get<DriverAccessibilityRulesMetricsDto>(
      `api/fleets/${fleetId}/drivers/${driverId}/accessibility-rules-metrics`,
    );
  }

  public getDriverHistory(driverId: string, query: DriverHistoryParamsDto): Observable<DriverHistoryChangesDto> {
    const params = new HttpParams({ fromObject: query as unknown as Record<string, string | number> });
    return this.http
      .get<DriverHistoryChangesDto>(`api/fleets/drivers/${driverId}/changes-history`, { params })
      .pipe(catchError(() => of(null)));
  }

  public getDriverHistoryInfo(
    driverId: string,
    changeType: DriverHistoryChange,
    eventId: string,
  ): Observable<DriverHistoryChangeItemDto> {
    return this.http
      .get<DriverHistoryChangeItemDto>(`api/fleets/drivers/${driverId}/changes-history/${changeType}/${eventId}`)
      .pipe(catchError(() => of(null)));
  }

  public getDriversNames(fleetId: string, driversIds: string[] = []): Observable<FleetDriverBasicInfoDto[]> {
    const params = new HttpParams().append('id', driversIds.join(','));
    return this.http.get<FleetDriverBasicInfoDto[]>(`api/fleets/${fleetId}/drivers/get-names`, { params });
  }

  public getDriverDenyList(driverId: string): Observable<DriverDenyListDto> {
    return this.http.get<DriverDenyListDto>(`api/fleets/drivers/${driverId}/deny-list`);
  }

  public clearDriverDenyList(driverId: string): Observable<DriverDenyListDto> {
    return this.http.delete<void>(`api/fleets/drivers/${driverId}/deny-list`).pipe(
      catchError(() => of({ count: 0 })),
      map(() => ({ count: 0 })),
    );
  }

  public getFleetDriverAccessSettings(fleetId: string, driverId: string): Observable<DriverVehicleAccessSettingsDto> {
    return this.http.get<DriverVehicleAccessSettingsDto>(
      `api/fleets/${fleetId}/drivers/${driverId}/access-to-vehicles`,
    );
  }

  public grantFleetDriverAccessToAllVehicles(fleetId: string, driverId: string, body = {}): Observable<void> {
    return this.http.put<void>(`api/fleets/${fleetId}/drivers/${driverId}/access-to-all-vehicles`, body);
  }

  public grantFleetDriverAccessToSpecificVehicles(
    fleetId: string,
    driverId: string,
    settings: DriverVehicleAccessSettingUpdateItemDto,
  ): Observable<void> {
    return this.http.put<void>(`api/fleets/${fleetId}/drivers/${driverId}/access-to-vehicles`, settings);
  }

  public removeFleetDriverAccessFromAllVehicles(fleetId: string, driverId: string): Observable<void> {
    return this.http.delete<void>(`api/fleets/${fleetId}/drivers/${driverId}/access-to-all-vehicles`);
  }

  public getDriversByCashLimit(
    fleetId: string,
    query: DriversByCashLimitQueryParamsDto,
  ): Observable<PaginationCollectionDto<DriverByCashLimitDto>> {
    return this.http.get<PaginationCollectionDto<DriverByCashLimitDto>>(`api/fleets/${fleetId}/drivers-by-cash-limit`, {
      params: removeEmptyParams(query),
    });
  }

  public deleteCashLimitRestrictionForDriver(
    fleetId: string,
    driverId: string,
    body: RemoveCashLimitRestrictionWithResetDto,
  ): Observable<void> {
    return this.http.delete<void>(`api/fleets/${fleetId}/drivers/${driverId}/restrictions/cash-limit`, { body });
  }

  public getDriverActiveFilters(
    fleetId: string,
    driverId: string,
    regionId: Region,
  ): Observable<DriverOrderFiltersCollectionDto> {
    this.loaderService.show();

    return this.http
      .get<DriverOrderFiltersCollectionDto>(`api/fleets/${fleetId}/drivers/${driverId}/filters/active`, {
        params: { regionId },
      })
      .pipe(finalize(() => this.loaderService.hide()));
  }
}
