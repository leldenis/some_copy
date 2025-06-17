import { HttpControllerService } from '@api/common';
import { archivedCommissionProgramsPeriodDaysAgo, findCurrentDriverOnVehicle } from '@api/controllers/bonuses/utils';
import { DriversService } from '@api/controllers/drivers/drivers.service';
import { VehiclesService } from '@api/controllers/vehicles/vehicles.service';
import { DriverBonusService } from '@api/datasource';
import { CommissionProgramsParticipantType, CommissionProgramType } from '@constant';
import {
  BrandingBonusCalculationPeriodOldDto,
  BrandingBonusCalculationPeriodsCollectionOld,
  BrandingBonusCalculationQueryOldDto,
  BrandingBonusCalculationsProgramOldDto,
  BrandingBonusProgramsCollectionOld,
  DriverCommissionProgramsQueryDto,
  FleetDriverBasicInfoDto,
  VehiclesCommissionProgramsQueryDto,
  CommissionProgramsCollectionDto,
  CommissionProgramsDto,
  VehicleBasicInfoDto,
  FleetWithArchivedDriversBasicInfoDto,
  InfinityScrollCollectionDto,
  BonusBrandingProgramNameDto,
  BrandingBonusCalculationPeriodDto,
  BrandingCalculationsProgramDto,
  CollectionDto,
  BrandingBonusProgramCalculationDto,
} from '@data-access';
import { Injectable } from '@nestjs/common';
import { forkJoin, mergeMap, Observable, of, switchMap } from 'rxjs';
import { map } from 'rxjs/operators';

import { Jwt } from '@uklon/nest-core';

@Injectable()
export class BonusesService extends HttpControllerService {
  constructor(
    private readonly driverBonusService: DriverBonusService,
    private readonly vehiclesService: VehiclesService,
    private readonly driversService: DriversService,
  ) {
    super();
  }

  public getBrandingProgramNames(token: Jwt, regionId: number): Observable<BonusBrandingProgramNameDto[]> {
    return this.driverBonusService
      .get<InfinityScrollCollectionDto<BonusBrandingProgramNameDto>>('api/v1/branding-bonus-programs', {
        token,
        params: { regions: regionId, offset: 0, limit: 50, status: ['active', 'deleted'] },
        paramsSerializer: this.paramsSerializer,
      })
      .pipe(
        map((collection) => ({
          ...collection,
          items: collection.items.map((item) => ({ id: item.id, name: item?.name ?? '', status: item?.status ?? '' })),
        })),
        map((collection) => collection.items),
      );
  }

  public getBrandingBonusCalculationPeriods(
    token: Jwt,
    fleetId: string,
    programId: string,
  ): Observable<BrandingBonusCalculationPeriodDto[]> {
    return this.driverBonusService
      .get<InfinityScrollCollectionDto<BrandingBonusCalculationPeriodDto>>(
        'api/v1/branding-bonus-programs/calculations/periods',
        {
          token,
          params: { fleet_id: fleetId, program_id: programId, offset: 0, limit: 50 },
        },
      )
      .pipe(
        map((collection: InfinityScrollCollectionDto<BrandingBonusCalculationPeriodDto>) => {
          const sortedItems: BrandingBonusCalculationPeriodDto[] = collection.items.map((item) => ({
            ...item,
            period: {
              range: item.period.range.sort((a, b) => a - b),
            },
          }));

          return sortedItems.sort((a, b) => b.period.range[1] - a.period.range[1]);
        }),
      );
  }

  public getBrandingBonusProgramDetailsByCalculationId(
    token: Jwt,
    calculationId: string,
  ): Observable<BrandingCalculationsProgramDto> {
    return this.driverBonusService.get<BrandingCalculationsProgramDto>(
      `/api/v1/branding-bonus-programs/calculations/${calculationId}/program`,
      { token },
    );
  }

  public getBrandingBonusProgramCalculations(
    token: Jwt,
    calculationId: string,
    fleetId: string,
    vehicleId: string,
  ): Observable<CollectionDto<BrandingBonusProgramCalculationDto>> {
    return this.driverBonusService
      .get<{ calculation_result: CollectionDto<BrandingBonusProgramCalculationDto> }>(
        `/api/v1/branding-bonus-programs/calculations/${calculationId}`,
        {
          token,
          params: { fleet_id: fleetId, vehicle_id: vehicleId },
        },
      )
      .pipe(
        switchMap(({ calculation_result }) => {
          const vehicleIds = calculation_result.items.map((item) => item.vehicle_id).filter(Boolean);

          if (vehicleIds.length === 0) {
            return of({ calculation_result, vehicleInfo: { items: [] } });
          }

          return forkJoin({
            calculation_result: of(calculation_result),
            vehicleInfo: this.vehiclesService.getFleetVehicleBasicInfo(token, vehicleIds),
          });
        }),
        switchMap(({ calculation_result, vehicleInfo }) => {
          const driverIds = vehicleInfo.items.map((vehicle) => vehicle?.selected_by_driver_id).filter(Boolean);

          if (driverIds.length === 0) {
            return of({ calculation_result, vehicleInfo, driverInfo: [] });
          }

          return forkJoin({
            calculation_result: of(calculation_result),
            vehicleInfo: of(vehicleInfo),
            driverInfo: this.driversService.getDriverBasicInfo(token, driverIds),
          });
        }),
        map(({ calculation_result, vehicleInfo, driverInfo }) => {
          const vehicleInfoMap = new Map(vehicleInfo.items.map((info) => [info.vehicle_id, info]));
          const driverInfoMap = new Map(driverInfo.map((info) => [info.driver_id, info]));

          return {
            items: calculation_result.items.map((item) => ({
              ...item,
              vehicle: item.vehicle_id ? vehicleInfoMap.get(item.vehicle_id) : null,
              driver: item.vehicle_id
                ? driverInfoMap.get(vehicleInfoMap.get(item.vehicle_id)?.selected_by_driver_id || '')
                : null,
            })),
          };
        }),
      );
  }

  public getBrandingBonusCalculationPeriodsOld(
    token: Jwt,
    query: BrandingBonusCalculationQueryOldDto,
  ): Observable<BrandingBonusCalculationPeriodsCollectionOld> {
    return this.driverBonusService
      .get<BrandingBonusCalculationPeriodsCollectionOld>('/api/v1/branding-calculation-periods', {
        token,
        params: { ...query, limit: 100 },
      })
      .pipe(
        map((collection: BrandingBonusCalculationPeriodsCollectionOld) => {
          const sortedItems: BrandingBonusCalculationPeriodOldDto[] = collection.items.map((item) => ({
            ...item,
            period: {
              range: item.period.range.sort((a, b) => a - b),
            },
          }));

          sortedItems.sort((a, b) => b.period.range[1] - a.period.range[1]);

          return {
            ...collection,
            items: sortedItems,
          };
        }),
      );
  }

  public getBrandingBonusCalculationsProgramOld(
    token: Jwt,
    calculationId: string,
  ): Observable<BrandingBonusCalculationsProgramOldDto> {
    return this.driverBonusService.get<BrandingBonusCalculationsProgramOldDto>(
      `/api/v1/calculations/${calculationId}/program`,
      { token },
    );
  }

  public getBrandingBonusProgramsOld(
    token: Jwt,
    calculationId: string,
    query: BrandingBonusCalculationQueryOldDto,
  ): Observable<BrandingBonusProgramsCollectionOld> {
    return this.driverBonusService
      .get<BrandingBonusProgramsCollectionOld>(`/api/v1/branding-calculations/${calculationId}/items`, {
        token,
        params: { ...query },
      })
      .pipe(
        switchMap((collection: BrandingBonusProgramsCollectionOld) => {
          const vehicleIds = collection.items.map((item) => item?.vehicle_id).filter(Boolean);

          if (vehicleIds.length === 0) {
            return of({ collection, vehicleInfo: { items: [] } });
          }

          return forkJoin({
            collection: of(collection),
            vehicleInfo: this.vehiclesService.getFleetVehicleBasicInfo(token, vehicleIds),
          });
        }),
        switchMap(({ collection, vehicleInfo }) => {
          const driverIds = vehicleInfo.items.map((vehicle) => vehicle?.selected_by_driver_id).filter(Boolean);

          if (driverIds.length === 0) {
            return of({ collection, vehicleInfo, driverInfo: [] });
          }

          return forkJoin({
            collection: of(collection),
            vehicleInfo: of(vehicleInfo),
            driverInfo: this.driversService.getDriverBasicInfo(token, driverIds),
          });
        }),
        map(({ collection, vehicleInfo, driverInfo }) => {
          const vehicleInfoMap = new Map(vehicleInfo.items.map((info) => [info.vehicle_id, info]));
          const driverInfoMap = new Map(driverInfo.map((info) => [info.driver_id, info]));
          const { items, has_more_items } = collection;

          return {
            items: items.map((item) => ({
              ...item,
              vehicle: item.vehicle_id ? vehicleInfoMap.get(item.vehicle_id) : null,
              driver: item.vehicle_id
                ? driverInfoMap.get(vehicleInfoMap.get(item.vehicle_id)?.selected_by_driver_id || '')
                : null,
            })),
            has_more_items,
          };
        }),
      );
  }

  public getDriversCommissionPrograms(
    token: Jwt,
    programType: CommissionProgramType,
    query: DriverCommissionProgramsQueryDto,
  ): Observable<CommissionProgramsCollectionDto> {
    return this.driverBonusService
      .get<CommissionProgramsCollectionDto>(`api/v1/commission-programs/participants/${programType}`, {
        token,
        params: {
          ...query,
          ...(programType === CommissionProgramType.ARCHIVED && archivedCommissionProgramsPeriodDaysAgo()),
          participant_type: CommissionProgramsParticipantType.DRIVER,
        },
      })
      .pipe(
        mergeMap((response: CommissionProgramsCollectionDto) => {
          const driverIds = query.driver_id
            ? [query.driver_id]
            : response.items.map((item) => item?.driver_id).filter(Boolean);

          const programs = query.driver_id
            ? response.items.filter((program) => program.driver_id === query.driver_id)
            : response.items;

          return forkJoin({
            response: of({ items: programs, has_more_items: response.has_more_items }),
            driver:
              programs.length === 0
                ? of([])
                : this.driversService.getFleetWithArchivedDriversBasicInfo(token, query.fleet_id, driverIds),
          });
        }),
        map(({ response, driver }) => {
          const driverMap = new Map(driver.map((item: FleetDriverBasicInfoDto) => [item.driver_id, item]));
          const { items, ...data } = response;

          return {
            items: items.map((item) => ({
              ...item,
              driver: item?.driver_id ? driverMap.get(item.driver_id) : null,
            })),
            has_more_items: data.has_more_items,
          } as CommissionProgramsCollectionDto;
        }),
      );
  }

  public getVehiclesCommissionPrograms(
    token: Jwt,
    programType: CommissionProgramType,
    query: VehiclesCommissionProgramsQueryDto,
  ): Observable<CommissionProgramsCollectionDto> {
    return this.driverBonusService
      .get<CommissionProgramsCollectionDto>(`api/v1/commission-programs/participants/${programType}`, {
        token,
        params: {
          ...query,
          ...(programType === CommissionProgramType.ARCHIVED && archivedCommissionProgramsPeriodDaysAgo()),
          participant_type: CommissionProgramsParticipantType.VEHICLE,
        },
      })
      .pipe(
        mergeMap((response) => this.mapCommissionProgramsWithVehicles(response, query, token)),
        mergeMap(({ response, vehicles }) =>
          this.mapVehiclesCommissionProgramsWithDrivers(response, vehicles, token, query),
        ),
        map(({ programs, vehicles, drivers }) =>
          this.mergeCommissionProgramsWithVehiclesAndDrivers(programs, vehicles, drivers),
        ),
      );
  }

  private mapCommissionProgramsWithVehicles(
    response: CommissionProgramsCollectionDto,
    query: VehiclesCommissionProgramsQueryDto,
    token: Jwt,
  ): Observable<{
    response: InfinityScrollCollectionDto<CommissionProgramsDto>;
    vehicles: VehicleBasicInfoDto[];
  }> {
    const vehicleIds = query.vehicle_id
      ? [query.vehicle_id]
      : response.items.map((item) => item?.vehicle_id).filter(Boolean);

    const programs = query.vehicle_id
      ? response.items.filter((program) => program.vehicle_id === query.vehicle_id)
      : response.items;

    return forkJoin({
      response: of({ items: programs, has_more_items: response.has_more_items }),
      vehicles:
        programs.length === 0
          ? of([])
          : this.vehiclesService.getFleetVehicleBasicInfo(token, vehicleIds).pipe(map((data) => data.items)),
    });
  }

  private mapVehiclesCommissionProgramsWithDrivers(
    response: InfinityScrollCollectionDto<CommissionProgramsDto>,
    vehicles: VehicleBasicInfoDto[],
    token: Jwt,
    query: VehiclesCommissionProgramsQueryDto,
  ): Observable<{
    programs: InfinityScrollCollectionDto<CommissionProgramsDto>;
    vehicles: VehicleBasicInfoDto[];
    drivers: FleetWithArchivedDriversBasicInfoDto[];
  }> {
    const driverIds = vehicles.map((vehicle) => vehicle.selected_by_driver_id).filter(Boolean);

    return forkJoin({
      programs: of(response),
      vehicles: of(vehicles),
      drivers:
        driverIds.length === 0
          ? of([])
          : this.driversService.getFleetWithArchivedDriversBasicInfo(token, query.fleet_id, driverIds),
    });
  }

  private mergeCommissionProgramsWithVehiclesAndDrivers(
    programs: InfinityScrollCollectionDto<CommissionProgramsDto>,
    vehicles: VehicleBasicInfoDto[],
    drivers: FleetWithArchivedDriversBasicInfoDto[],
  ): CommissionProgramsCollectionDto {
    const vehiclesMap = new Map(vehicles.map((item) => [item.vehicle_id, item]));
    const driversMap = new Map(drivers.map((driver) => [driver.driver_id, driver]));

    const { items, ...data } = programs;

    return {
      items: items.map((item) => ({
        ...item,
        vehicle: item?.vehicle_id ? vehiclesMap.get(item.vehicle_id) : null,
        driver: item?.vehicle_id
          ? findCurrentDriverOnVehicle(
              item.vehicle_id,
              vehiclesMap,
              vehiclesMap.get(item.vehicle_id).selected_by_driver_id,
              driversMap,
            )
          : null,
      })),
      has_more_items: data.has_more_items,
    };
  }
}
