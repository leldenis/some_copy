import { addBlockedByManagerStatus } from '@api/common/utils';
import { getMerchantIncome, mapSplits } from '@api/common/utils/splits-mapper';
import { FinanceService } from '@api/controllers/finance/finance.service';
import { VehiclesService } from '@api/controllers/vehicles/vehicles.service';
import { PregameService, SearchService } from '@api/datasource';
import { DriverOrderingService } from '@api/datasource/driver-ordering.service';
import { PartnersService } from '@api/datasource/partners.service';
import { DriverVehicleAccessType, PhotoSize, TicketStatus } from '@constant';
import {
  CollectionCursorDto,
  CursorPageRequestDto,
  DateFilterDto,
  DriverAccessibilityRulesMetricsDto,
  DriverByCashLimitDto,
  DriverDenyListDto,
  DriverFilter,
  DriverFinanceProfileDto,
  DriverHistoryChange,
  DriverHistoryChangeItemDto,
  DriverHistoryChangesDto,
  DriverOrderFiltersCollectionDto,
  DriverOrderFilterSectorsDto,
  DriverProductConfigurationsCollectionDto,
  DriverRestrictionListDto,
  DriverRideConditionListDto,
  DriversByCashLimitQueryParamsDto,
  DriversQueryParamsDto,
  DriverVehicleAccessSettingsDto,
  DriverVehicleAccessSettingUpdateItemDto,
  FleetDriverBasicInfoDto,
  FleetDriverDto,
  FleetDriverFeedbackDto,
  FleetDriverFeedbackFilterDto,
  FleetDriverRegistrationTicketDto,
  FleetDriverRestrictionDeleteDto,
  FleetDriverRestrictionUpdateDto,
  FleetDriversCollection,
  FleetVehicleDto,
  FleetWithArchivedDriversBasicInfoDto,
  InfinityPageRequestDto,
  InfinityScrollCollectionDto,
  PaginationCollectionDto,
  PhotosDto,
  ProductConfigurationUpdateItemCollectionDto,
  RemoveCashLimitRestrictionWithResetDto,
  RemoveReasonDto,
  SectorTagDto,
  SetDriverProductConfigurationDto,
  some,
  StatisticDetailsDto,
  UpdateDriverFinanceProfileDto,
} from '@data-access';
import { Injectable } from '@nestjs/common';
import { forkJoin, map, Observable, of, switchMap, zip } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { Jwt } from '@uklon/nest-core';
import { Region } from '@uklon/types';

import { HttpControllerService, RequestConfig } from '../../common';

interface AccessedVehicle {
  id: string;
  license_plate: string;
}

interface PregameDrivers {
  data: {
    driver_id: string;
    is_device_online: boolean;
    is_driver_in_idle: boolean;
    active_driver_filters: DriverFilter[];
  }[];
}

interface DriverOrderSector {
  id: string;
  city_id: Region;
  name: string;
  tags: SectorTagDto[];
}

@Injectable()
export class DriversService extends HttpControllerService {
  constructor(
    private readonly partnersService: PartnersService,
    private readonly financeService: FinanceService,
    private readonly vehiclesService: VehiclesService,
    private readonly pregameService: PregameService,
    private readonly driverOrderingService: DriverOrderingService,
    private readonly searchService: SearchService,
  ) {
    super();
  }

  public getFleetDrivers(
    token: Jwt,
    fleetId: string,
    query: DriversQueryParamsDto,
    regionId: number,
  ): Observable<FleetDriversCollection> {
    return this.partnersService
      .get<FleetDriversCollection>(`api/v1/fleets/${fleetId}/drivers`, {
        token,
        params: { ...query },
      })
      .pipe(
        switchMap((collection) => {
          const driverIds = collection.items.map(({ id }) => id);
          const pregameDrivers$ = this.getPreGameDrivers(regionId, fleetId, driverIds, token);

          return zip([of(collection), pregameDrivers$]);
        }),
        map(([{ items, total_count }, { data: pregameDrivers }]) => {
          return {
            items: items.map((item) => {
              const pregameDriver = pregameDrivers.find(({ driver_id }) => driver_id === item.id.replace(/-/g, ''));

              return {
                ...item,
                is_online: pregameDriver
                  ? pregameDriver.is_device_online &&
                    !pregameDriver.is_driver_in_idle &&
                    item.selected_vehicle?.fleet_id === fleetId
                  : false,
                active_driver_filters: pregameDriver?.active_driver_filters ?? [],
              };
            }),
            total_count,
          };
        }),
      );
  }

  public getDriverBasicInfo(token: Jwt, id: string[]): Observable<FleetDriverBasicInfoDto[]> {
    return this.partnersService.get<FleetDriverBasicInfoDto[]>('api/v1/drivers/basic-info', {
      token,
      params: { id },
      paramsSerializer: {
        serialize: this.paramsSerializer,
      },
    });
  }

  public getFleetWithArchivedDriversBasicInfo(
    token: Jwt,
    fleetId: string,
    id: string[],
    withArchived = true,
  ): Observable<FleetWithArchivedDriversBasicInfoDto[]> {
    return this.partnersService.get<FleetWithArchivedDriversBasicInfoDto[]>(
      `api/v1/fleets/${fleetId}/drivers/basic-info`,
      {
        token,
        params: { id, with_archived: withArchived },
        paramsSerializer: {
          serialize: this.paramsSerializer,
        },
      },
    );
  }

  public getFleetDriversNamesByIds(token: Jwt, fleetId: string, ids: string): Observable<FleetDriverBasicInfoDto[]> {
    const id = ids.split(',');
    return this.partnersService.get<FleetDriverBasicInfoDto[]>(`api/v1/fleets/${fleetId}/drivers/:get-names-by-ids`, {
      token,
      params: { id },
      paramsSerializer: {
        serialize: this.paramsSerializer,
      },
    });
  }

  public removeFleetDriverById(
    token: Jwt,
    fleetId: string,
    vehicleId: string,
    body: RemoveReasonDto,
  ): Observable<void> {
    return this.partnersService.delete<void>(`api/v1/fleets/${fleetId}/drivers/${vehicleId}`, { data: body, token });
  }

  public getFleetDriverById(token: Jwt, fleetId: string, driverId: string): Observable<FleetDriverDto> {
    const driverV3 = this.partnersService.get<FleetDriverDto>(`api/v3/drivers/${driverId}`, { token });
    const driver = this.getFleetDriverInfoById(token, fleetId, driverId);

    return forkJoin([driverV3, driver]).pipe(
      switchMap(([{ restrictions }, driverInfo]) => {
        const driverDetails: FleetDriverDto = { ...driverInfo, restrictions };

        if (driverDetails?.selected_vehicle?.license_plate) {
          return this.vehiclesService
            .getFleetVehicles(token, fleetId, driverDetails?.selected_vehicle?.license_plate, 0, 1)
            .pipe(
              map((response) => {
                return {
                  ...driverDetails,
                  selected_vehicle: {
                    ...driverDetails.selected_vehicle,
                    currentFleet: response.items.length > 0,
                  },
                };
              }),
            );
        }
        return of(driverDetails);
      }),
    );
  }

  public getFleetDriverInfoById(token: Jwt, fleetId: string, driverId: string): Observable<FleetDriverDto> {
    return this.partnersService.get<FleetDriverDto>(`api/v1/fleets/${fleetId}/drivers/${driverId}`, {
      token,
    });
  }

  public getFleetDriverRestrictions(
    token: Jwt,
    fleetId: string,
    driverId: string,
  ): Observable<DriverRestrictionListDto> {
    return this.partnersService.get(`api/v1/fleets/${fleetId}/drivers/${driverId}/restrictions`, { token });
  }

  public getFleetDriverRestrictionsSettings(
    token: Jwt,
    fleetId: string,
    driverId: string,
  ): Observable<DriverRestrictionListDto> {
    return this.partnersService.get(`api/v1/fleets/${fleetId}/drivers/${driverId}/restrictions/settings`, { token });
  }

  public setFleetDriverRestriction(
    token: Jwt,
    fleetId: string,
    driverId: string,
    body: FleetDriverRestrictionUpdateDto,
  ): Observable<DriverRestrictionListDto> {
    return this.partnersService.put(`api/v1/fleets/${fleetId}/drivers/${driverId}/restrictions`, body, { token });
  }

  public delFleetDriverRestriction(
    token: Jwt,
    fleetId: string,
    driverId: string,
    data: FleetDriverRestrictionDeleteDto,
  ): Observable<DriverRestrictionListDto> {
    return this.partnersService.delete(`api/v1/fleets/${fleetId}/drivers/${driverId}/restrictions`, { token, data });
  }

  public getDriverPhotos(token: Jwt, driverId: string, image_size: PhotoSize): Observable<PhotosDto> {
    return this.partnersService.get<PhotosDto>(`api/v1/drivers/${driverId}/images`, {
      token,
      params: { image_size },
    });
  }

  public getFleetDriverProductsConfigurations(
    token: Jwt,
    fleetId: string,
    driverId: string,
  ): Observable<DriverProductConfigurationsCollectionDto> {
    return this.partnersService.get<DriverProductConfigurationsCollectionDto>(
      `api/v1/fleets/${fleetId}/drivers/${driverId}/products/configurations`,
      { token },
    );
  }

  public updateFleetDriverProductConfigurations(
    token: Jwt,
    fleetId: string,
    driverId: string,
    body: ProductConfigurationUpdateItemCollectionDto,
  ): Observable<void> {
    return this.partnersService.put<void>(
      `api/v1/fleets/${fleetId}/drivers/${driverId}/products/configurations`,
      body,
      { token },
    );
  }

  public updateFleetDriverProductConfigurationsById(
    token: Jwt,
    fleetId: string,
    driverId: string,
    productId: string,
    body: SetDriverProductConfigurationDto,
  ): Observable<void> {
    return this.partnersService.put<void>(
      `api/v1/fleets/${fleetId}/drivers/${driverId}/products/${productId}/configurations`,
      body,
      { token },
    );
  }

  public getFinanceProfile(token: Jwt, fleetId: string, driverId: string): Observable<DriverFinanceProfileDto> {
    return this.partnersService.get(`api/v1/fleets/${fleetId}/drivers/${driverId}/finance-profile`, { token });
  }

  public setFinanceProfile(
    token: Jwt,
    fleetId: string,
    driverId: string,
    body: UpdateDriverFinanceProfileDto,
  ): Observable<DriverFinanceProfileDto> {
    return this.partnersService.put(`api/v1/fleets/${fleetId}/drivers/${driverId}/finance-profile`, body, { token });
  }

  public getTickets(
    token: Jwt,
    fleetId: string,
    page: CursorPageRequestDto,
    filter?: {
      phone: string;
      status: TicketStatus;
    },
  ): Observable<CollectionCursorDto<FleetDriverRegistrationTicketDto>> {
    const params = addBlockedByManagerStatus({
      limit: page?.limit,
      cursor: page?.cursor,
      phone: filter?.phone,
      status: filter?.status,
    });

    return this.partnersService.get(`api/v1/fleets/${fleetId}/tickets/drivers/registrations`, {
      token,
      params,
      paramsSerializer: {
        serialize: this.paramsSerializer,
      },
    });
  }

  public getFeedbacks(
    token: Jwt,
    fleetId: string,
    page: InfinityPageRequestDto,
    filter?: FleetDriverFeedbackFilterDto,
  ): Observable<InfinityScrollCollectionDto<FleetDriverFeedbackDto>> {
    return this.partnersService.get(`api/v1/fleets/${fleetId}/drivers/feedbacks`, {
      token,
      params: {
        limit: page?.limit,
        offset: page?.offset,
        created_at_from: filter?.created_at_from,
        created_at_to: filter?.created_at_to,
        driver_id: filter?.driver_id,
      },
      paramsSerializer: {
        serialize: this.paramsSerializer,
      },
    });
  }

  public getDriverRideConditions(token: Jwt, driverId: string): Observable<DriverRideConditionListDto> {
    return this.partnersService.get(`api/v1/drivers/${driverId}/ride-conditions`, { token });
  }

  public getFleetDriverStatistic(
    token: Jwt,
    fleetId: string,
    driverId: string,
    params?: DateFilterDto,
  ): Observable<StatisticDetailsDto> {
    const config: RequestConfig = {
      token,
      params,
      paramsSerializer: {
        serialize: this.paramsSerializer,
      },
    };

    return this.financeService.getFleetEntrepreneurs(token, fleetId, false).pipe(
      switchMap((entrepreneurs) => {
        return this.partnersService
          .get<StatisticDetailsDto>(`api/v2/fleets/${fleetId}/drivers/${driverId}/statistic`, config)
          .pipe(
            map((data) => (some(data, (prop) => !!prop) ? data : null)),
            map((stats) => {
              if (!stats) return stats;

              // eslint-disable-next-line no-param-reassign
              stats.profit.order.merchant = getMerchantIncome(
                stats?.split_payments,
                stats?.earnings_for_period?.currency,
              );
              // eslint-disable-next-line no-param-reassign
              stats.grouped_splits = mapSplits(entrepreneurs?.items, stats?.split_payments);
              return stats;
            }),
          );
      }),
    );
  }

  public getFleetDriverAccessibilityRulesMetrics(
    token: Jwt,
    fleetId: string,
    driverId: string,
  ): Observable<DriverAccessibilityRulesMetricsDto> {
    return this.partnersService.get(`api/v1/fleets/${fleetId}/drivers/${driverId}/accessibility-rules-metrics`, {
      token,
    });
  }

  public getFleetDriverHistory(
    token: Jwt,
    driverId: string,
    vehicleId: string,
    fleetId: string,
    changeType: string,
    page: CursorPageRequestDto,
  ): Observable<DriverHistoryChangesDto> {
    const config: RequestConfig = {
      token,
      params: {
        vehicle_id: vehicleId,
        fleet_id: fleetId,
        change_type: changeType,
        cursor: page.cursor,
        limit: page.limit,
      },
      paramsSerializer: {
        serialize: this.paramsSerializer,
      },
    };

    return this.partnersService.get(`api/v1/drivers/${driverId}/changes-history`, config);
  }

  public getFleetDriverHistoryChangeInfo(
    token: Jwt,
    driverId: string,
    changeType: DriverHistoryChange,
    eventId: string,
  ): Observable<DriverHistoryChangeItemDto> {
    return this.partnersService.get<DriverHistoryChangeItemDto>(
      `api/v1/drivers/${driverId}/changes-history/${changeType}/${eventId}`,
      { token },
    );
  }

  public getDenyList(driverId: string, token: Jwt): Observable<DriverDenyListDto> {
    return this.partnersService.get<DriverDenyListDto>(`api/v1/drivers/${driverId}/deny-list`, { token });
  }

  public clearDenyList(driverId: string, token: Jwt): Observable<void> {
    return this.partnersService.delete<void>(`api/v1/drivers/${driverId}/deny-list`, { token });
  }

  public getFleetDriverAccessSettings(
    token: Jwt,
    fleetId: string,
    driverId: string,
  ): Observable<DriverVehicleAccessSettingsDto> {
    return this.partnersService
      .get<{
        access_type: DriverVehicleAccessType;
        vehicles: AccessedVehicle[];
        comment: string;
      }>(`api/v1/fleets/${fleetId}/drivers/${driverId}/access-to-vehicles`, { token })
      .pipe(
        map(({ access_type, vehicles, comment }) => ({
          access_type,
          comment,
          vehicles: vehicles.map(({ id, license_plate }) => ({ id, licencePlate: license_plate }) as FleetVehicleDto),
        })),
      );
  }

  public grantFleetDriverAccessToAllVehicles(
    token: Jwt,
    fleetId: string,
    driverId: string,
    body: object,
  ): Observable<void> {
    return this.partnersService.put<void>(`api/v1/fleets/${fleetId}/drivers/${driverId}/access-to-all-vehicles`, body, {
      token,
    });
  }

  public grantFleetDriverAccessToSpecificVehicles(
    token: Jwt,
    fleetId: string,
    driverId: string,
    body: DriverVehicleAccessSettingUpdateItemDto,
  ): Observable<void> {
    return this.partnersService.put<void>(`api/v1/fleets/${fleetId}/drivers/${driverId}/access-to-vehicles`, body, {
      token,
    });
  }

  public removeFleetDriverAccessFromAllVehicles(token: Jwt, fleetId: string, driverId: string): Observable<void> {
    return this.partnersService.delete<void>(`api/v1/fleets/${fleetId}/drivers/${driverId}/access-to-all-vehicles`, {
      token,
    });
  }

  public getDriversByCashLimit(
    token: Jwt,
    fleetId: string,
    params: DriversByCashLimitQueryParamsDto,
  ): Observable<PaginationCollectionDto<DriverByCashLimitDto>> {
    return this.partnersService.get<PaginationCollectionDto<DriverByCashLimitDto>>(
      `api/v1/fleets/${fleetId}/drivers/by-cash-limit`,
      {
        token,
        params,
      },
    );
  }

  public deleteCashLimitRestrictionForDriver(
    token: Jwt,
    fleetId: string,
    driverId: string,
    data: RemoveCashLimitRestrictionWithResetDto,
  ): Observable<void> {
    return this.partnersService.delete(`api/v1/fleets/${fleetId}/drivers/${driverId}/restrictions/cash-limit`, {
      token,
      data,
    });
  }

  public getDriverActiveFilters(
    token: Jwt,
    fleetId: string,
    driverId: string,
    regionId: Region,
  ): Observable<DriverOrderFiltersCollectionDto> {
    return this.getDriverSectorsByRegion(token, regionId).pipe(
      switchMap((sectors) => {
        return this.partnersService
          .get<DriverOrderFiltersCollectionDto>(`api/v1/fleets/${fleetId}/drivers/${driverId}/order-filters/active`, {
            token,
          })
          .pipe(map((res) => this.addSectorsTags(res, sectors)));
      }),
    );
  }

  private getDriverSectorsByRegion(token: Jwt, regionId: Region): Observable<DriverOrderSector[]> {
    return this.searchService
      .get<{ sectors: DriverOrderSector[] }>(`api/v1/regions/${regionId}/sectors`, {
        token,
        params: { include_geometry: false },
      })
      .pipe(
        map(({ sectors }) => sectors),
        catchError(() => of([])),
      );
  }

  private getPreGameDrivers(
    region_id: number | string,
    fleet_id: string,
    driver_ids: string[],
    token: Jwt,
  ): Observable<PregameDrivers> {
    return region_id && region_id !== 'undefined'
      ? this.pregameService.get<PregameDrivers>('api/v1/fleet-drivers', {
          token,
          params: {
            region_id,
            fleet_id,
            driver_ids,
          },
          paramsSerializer: {
            serialize: this.paramsSerializer,
          },
        })
      : of({ data: [] });
  }

  private addSectorsTags(
    { order_filters }: DriverOrderFiltersCollectionDto,
    sectors: DriverOrderSector[],
  ): DriverOrderFiltersCollectionDto {
    const mapToTags = (entity: DriverOrderFilterSectorsDto): SectorTagDto[][] => {
      if (entity?.sector_ids?.length === 0 || sectors?.length === 0) return [];
      const tags = entity.sector_ids?.map((id) => sectors?.find((sector) => sector?.id === id)?.tags ?? []);

      return tags.every((tag) => tag.length === 0) ? [] : tags;
    };

    const getSectorTags = (sectorFilters: DriverOrderFilterSectorsDto): DriverOrderFilterSectorsDto => {
      return sectorFilters ? { ...sectorFilters, sectors_tags: mapToTags(sectorFilters) } : { is_enabled: false };
    };

    const filters = order_filters.map((filter) => {
      return {
        ...filter,
        filters: {
          ...filter.filters,
          include_source_sectors: getSectorTags(filter?.filters?.include_source_sectors),
          include_destination_sectors: getSectorTags(filter?.filters?.include_destination_sectors),
          exclude_source_sectors: getSectorTags(filter?.filters?.exclude_source_sectors),
          exclude_destination_sectors: getSectorTags(filter?.filters?.exclude_destination_sectors),
        },
      };
    });

    return { order_filters: filters };
  }
}
