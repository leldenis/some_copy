import { RequestConfig } from '@api/common';
import { HttpControllerService } from '@api/common/http/http-controller.service';
import { FleetVehicleCollectionEntity, FleetVehicleCollectionQueryEntity } from '@api/controllers/vehicles/entities';
import { PartnersService } from '@api/datasource/partners.service';
import { PhotoSize } from '@constant';
import {
  CursorPageRequestDto,
  FleetVehicleCollectionDto,
  FleetVehicleCollectionQueryDto,
  GatewayCollectionDto,
  GatewayFleetVehicleDto,
  PaginationCollectionDto,
  PhotosDto,
  ProductConfigurationUpdateItemCollectionDto,
  RemoveReasonDto,
  VehicleAccessSettingsDto,
  VehicleAccessSettingUpdateItemDto,
  VehicleBasicInfoCollection,
  VehicleDetailsDto,
  VehicleDto,
  VehicleHistoryChangeItemDto,
  VehicleHistoryChangesDto,
  VehicleHistoryType,
  VehicleProductConfigurationCollectionDto,
} from '@data-access';
import { Injectable } from '@nestjs/common';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Jwt } from '@uklon/nest-core';

const FLEET_URL = 'api/v1/fleets';
const FLEET_VEHICLES_URL = `${FLEET_URL}/{0}/vehicles`;
const FLEET_VEHICLES_URL_V2 = `api/v2/fleets/{0}/vehicles`;
const FLEET_VEHICLE_BY_ID_URL = `${FLEET_VEHICLES_URL}/{1}`;
const FLEET_VEHICLE_PRODUCT_CONFIGURATION_URL = `${FLEET_VEHICLE_BY_ID_URL}/product-configurations`;
const RELEASE_FLEET_VEHICLE_BY_ID_URL_V1 = `${FLEET_VEHICLE_BY_ID_URL}/:release`;
const FLEET_VEHICLE_PHOTOS = 'api/v1/vehicles/{0}/images';
const FLEET_VEHICLE_ACCESS_SETTINGS_URL = 'api/v1/fleets/{0}/vehicles/{1}/access-to-drivers';
const FLEET_VEHICLE_ACCESS_TO_ALL_DRIVERS_URL = 'api/v1/fleets/{0}/vehicles/{1}/access-to-all-drivers';
const FLEET_VEHICLE_ACCESS_TO_SPECIFIC_DRIVERS_URL = 'api/v1/fleets/{0}/vehicles/{1}/access-to-drivers';

const PHOTO_CONTROL_HISTORY = new Set<VehicleHistoryType>([
  VehicleHistoryType.PHOTO_CONTROL_PASSED,
  VehicleHistoryType.PHOTO_CONTROL_FAILED,
  VehicleHistoryType.PHOTO_CONTROL_TICKET_CREATION_REJECTED,
]);

@Injectable()
export class VehiclesService extends HttpControllerService {
  constructor(private readonly partnersService: PartnersService) {
    super();
  }

  public getFleetVehicles(
    token: Jwt,
    fleetId: string,
    license_plate: string,
    offset = 0,
    limit = 30,
  ): Observable<PaginationCollectionDto<VehicleDto>> {
    const url = this.buildUrl(FLEET_VEHICLES_URL_V2, fleetId);

    return this.partnersService.get<PaginationCollectionDto<VehicleDto>>(url, {
      token,
      params: { license_plate, offset, limit },
    });
  }

  public getFleetVehiclesV2(
    token: Jwt,
    fleetId: string,
    queryParams: FleetVehicleCollectionQueryDto,
  ): Observable<FleetVehicleCollectionDto> {
    const url = this.buildUrl(FLEET_VEHICLES_URL_V2, fleetId);
    const queryEntity = plainToInstance(FleetVehicleCollectionQueryEntity, queryParams);
    const params = instanceToPlain(queryEntity, { excludeExtraneousValues: true });
    return this.partnersService
      .get<GatewayCollectionDto<GatewayFleetVehicleDto>>(url, { token, params })
      .pipe(map((collection) => new FleetVehicleCollectionEntity(collection.items, collection.total_count)));
  }

  public getFleetVehicleProductConfigurations(
    token: Jwt,
    fleetId: string,
    vehicleId: string,
  ): Observable<VehicleProductConfigurationCollectionDto> {
    const url = this.buildUrl(FLEET_VEHICLE_PRODUCT_CONFIGURATION_URL, fleetId, vehicleId);

    return this.partnersService.get<VehicleProductConfigurationCollectionDto>(url, { token });
  }

  public updateFleetVehicleProductConfigurations(
    token: Jwt,
    fleetId: string,
    vehicleId: string,
    body: ProductConfigurationUpdateItemCollectionDto,
  ): Observable<void> {
    const url = this.buildUrl(FLEET_VEHICLE_PRODUCT_CONFIGURATION_URL, fleetId, vehicleId);

    return this.partnersService.put<void>(url, body, { token });
  }

  public getFleetVehicleById(token: Jwt, fleetId: string, vehicleId: string): Observable<VehicleDetailsDto> {
    return this.partnersService.get<VehicleDetailsDto>(`api/v2/fleets/${fleetId}/vehicles/${vehicleId}`, { token });
  }

  public deleteFleetVehicleById(
    token: Jwt,
    fleetId: string,
    vehicleId: string,
    body: RemoveReasonDto,
  ): Observable<void> {
    const url = this.buildUrl(FLEET_VEHICLE_BY_ID_URL, fleetId, vehicleId);

    return this.partnersService.delete<void>(url, { data: body, token });
  }

  public releaseFleetVehicleById(token: Jwt, fleetId: string, vehicleId: string): Observable<void> {
    const url = this.buildUrl(RELEASE_FLEET_VEHICLE_BY_ID_URL_V1, fleetId, vehicleId);

    return this.partnersService.post<void>(url, null, { token });
  }

  public getFleetVehiclePhotos(token: Jwt, vehicleId: string, image_size: PhotoSize): Observable<PhotosDto> {
    const url = this.buildUrl(FLEET_VEHICLE_PHOTOS, vehicleId);

    return this.partnersService.get<PhotosDto>(url, { token, params: { image_size } });
  }

  public getFleetVehicleAccessSettings(
    token: Jwt,
    fleetId: string,
    vehicleId: string,
  ): Observable<VehicleAccessSettingsDto> {
    const url = this.buildUrl(FLEET_VEHICLE_ACCESS_SETTINGS_URL, fleetId, vehicleId);

    return this.partnersService.get(url, { token });
  }

  public grantFleetVehicleAccessToAllDrivers(
    token: Jwt,
    fleetId: string,
    vehicleId: string,
    body: object,
  ): Observable<void> {
    const url = this.buildUrl(FLEET_VEHICLE_ACCESS_TO_ALL_DRIVERS_URL, fleetId, vehicleId);

    return this.partnersService.put<void>(url, body, { token });
  }

  public grantFleetVehicleAccessToSpecificDrivers(
    token: Jwt,
    fleetId: string,
    vehicleId: string,
    body: VehicleAccessSettingUpdateItemDto,
  ): Observable<void> {
    const url = this.buildUrl(FLEET_VEHICLE_ACCESS_TO_SPECIFIC_DRIVERS_URL, fleetId, vehicleId);

    return this.partnersService.put<void>(url, body, { token });
  }

  public removeFleetVehicleAccessFromAllDrivers(
    token: Jwt,
    fleetId: string,
    vehicleId: string,
    body: Pick<RemoveReasonDto, 'comment'>,
  ): Observable<void> {
    const url = this.buildUrl(FLEET_VEHICLE_ACCESS_TO_ALL_DRIVERS_URL, fleetId, vehicleId);

    return this.partnersService.delete<void>(url, { data: body, token });
  }

  public getFleetVehicleHistory(
    token: Jwt,
    vehicleId: string,
    fleetId: string,
    changeType: string,
    page: CursorPageRequestDto,
  ): Observable<VehicleHistoryChangesDto> {
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

    return this.partnersService
      .get<VehicleHistoryChangesDto>(`api/v1/vehicles/${vehicleId}/changes-history`, config)
      .pipe(
        map((response) => ({
          ...response,
          items: response.items.map((item) => ({
            ...item,
            has_additional_data: PHOTO_CONTROL_HISTORY.has(item.change_type) ? false : item.has_additional_data,
          })),
        })),
      );
  }

  public getFleetVehicleHistoryChangeInfo(
    token: Jwt,
    vehicleId: string,
    changeType: VehicleHistoryType,
    eventId: string,
  ): Observable<VehicleHistoryChangeItemDto> {
    return this.partnersService.get(`api/v1/vehicles/${vehicleId}/changes-history/${changeType}/${eventId}`, { token });
  }

  public getFleetVehicleBasicInfo(token: Jwt, id: string[]): Observable<VehicleBasicInfoCollection> {
    return this.partnersService.get<VehicleBasicInfoCollection>('api/v1/vehicles/basic-info', {
      token,
      params: { id },
      paramsSerializer: {
        serialize: this.paramsSerializer,
      },
    });
  }
}
