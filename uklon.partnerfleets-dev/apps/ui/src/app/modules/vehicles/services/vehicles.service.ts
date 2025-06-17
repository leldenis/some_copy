import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PhotoSize } from '@constant';
import {
  FleetVehicleCollectionDto,
  FleetVehicleCollectionQueryDto,
  PhotosDto,
  ProductConfigurationUpdateItemCollectionDto,
  RemoveReasonDto,
  VehicleAccessSettingsDto,
  VehicleAccessSettingUpdateItemDto,
  VehicleBasicInfoDto,
  VehicleDetailsDto,
  VehicleHistoryChangeItemDto,
  VehicleHistoryChangesDto,
  VehicleHistoryParamsDto,
  VehicleHistoryType,
  VehicleProductConfigurationCollectionDto,
} from '@data-access';
import { HttpClientService } from '@ui/core/services/http-client.service';
import { catchError, Observable, of } from 'rxjs';

const FLEET_VEHICLES_URL = 'api/fleets/{0}/vehicles';
const FLEET_VEHICLE_BY_ID_URL = `${FLEET_VEHICLES_URL}/{1}`;
const FLEET_VEHICLE_PHOTOS = `${FLEET_VEHICLE_BY_ID_URL}/images`;
const RELEASE_FLEET_VEHICLE_BY_ID_URL = `${FLEET_VEHICLE_BY_ID_URL}/release`;
const FLEET_VEHICLE_PRODUCT_CONFIGURATION_URL = `${FLEET_VEHICLE_BY_ID_URL}/product-configurations`;
const FLEET_VEHICLE_ACCESS_TO_ALL_DRIVERS_URL = `${FLEET_VEHICLE_BY_ID_URL}/access-to-all-drivers`;
const FLEET_VEHICLE_ACCESS_TO_SPECIFIC_DRIVERS_URL = `${FLEET_VEHICLE_BY_ID_URL}/access-to-drivers`;
const FLEET_VEHICLE_ACCESS_SETTINGS_URL = `${FLEET_VEHICLE_BY_ID_URL}/access-to-drivers`;
const FLEET_VEHICLE_CHANGES_HISTORY = `${FLEET_VEHICLES_URL}/{1}/changes-history`;
const FLEET_VEHICLE_CHANGE_DETAILS = `${FLEET_VEHICLES_URL}/{1}/changes-history/{2}/{3}`;

@Injectable({ providedIn: 'root' })
export class VehiclesService extends HttpClientService {
  constructor(private readonly http: HttpClient) {
    super();
  }

  public getFleetVehicles(
    fleetId: string,
    queryParams: FleetVehicleCollectionQueryDto,
  ): Observable<FleetVehicleCollectionDto> {
    const url = this.buildUrl(FLEET_VEHICLES_URL, fleetId);
    const params = new HttpParams({
      fromObject: queryParams as Record<string, FleetVehicleCollectionQueryDto[keyof FleetVehicleCollectionQueryDto]>,
    });
    return this.http.get<FleetVehicleCollectionDto>(url, { params });
  }

  public getFleetVehicleProductConfigurations(
    fleetId: string,
    vehicleId: string,
  ): Observable<VehicleProductConfigurationCollectionDto> {
    return this.http.get<VehicleProductConfigurationCollectionDto>(
      this.buildUrl(FLEET_VEHICLE_PRODUCT_CONFIGURATION_URL, fleetId, vehicleId),
    );
  }

  public updateFleetVehicleProductConfigurations(
    fleetId: string,
    vehicleId: string,
    body: ProductConfigurationUpdateItemCollectionDto,
  ): Observable<void> {
    return this.http.put<void>(this.buildUrl(FLEET_VEHICLE_PRODUCT_CONFIGURATION_URL, fleetId, vehicleId), { ...body });
  }

  public getFleetVehicleById(fleetId: string, vehicleId: string): Observable<VehicleDetailsDto> {
    return this.http.get<VehicleDetailsDto>(`api/fleets/${fleetId}/vehicles/${vehicleId}`);
  }

  public releaseFleetVehicleById(fleetId: string, vehicleId: string): Observable<void> {
    return this.http.post<void>(this.buildUrl(RELEASE_FLEET_VEHICLE_BY_ID_URL, fleetId, vehicleId), null);
  }

  public deleteFleetVehicleById(fleetId: string, vehicleId: string, body: RemoveReasonDto): Observable<void> {
    return this.http.delete<void>(this.buildUrl(FLEET_VEHICLE_BY_ID_URL, fleetId, vehicleId), { body });
  }

  public getFleetVehiclePhotos(fleetId: string, vehicleId: string, image_size: PhotoSize): Observable<PhotosDto> {
    return this.http.get<PhotosDto>(this.buildUrl(FLEET_VEHICLE_PHOTOS, fleetId, vehicleId), {
      params: {
        image_size,
      },
    });
  }

  public getFleetVehicleAccessSettings(fleetId: string, vehicleId: string): Observable<VehicleAccessSettingsDto> {
    return this.http.get<VehicleAccessSettingsDto>(
      this.buildUrl(FLEET_VEHICLE_ACCESS_SETTINGS_URL, fleetId, vehicleId),
    );
  }

  public grantFleetVehicleAccessToAllDrivers(fleetId: string, vehicleId: string, body = {}): Observable<void> {
    return this.http.put<void>(this.buildUrl(FLEET_VEHICLE_ACCESS_TO_ALL_DRIVERS_URL, fleetId, vehicleId), body);
  }

  public grantFleetVehicleAccessToSpecificDrivers(
    fleetId: string,
    vehicleId: string,
    settings: VehicleAccessSettingUpdateItemDto,
  ): Observable<void> {
    return this.http.put<void>(
      this.buildUrl(FLEET_VEHICLE_ACCESS_TO_SPECIFIC_DRIVERS_URL, fleetId, vehicleId),
      settings,
    );
  }

  public removeFleetVehicleAccessFromAllDrivers(
    fleetId: string,
    vehicleId: string,
    body: Pick<RemoveReasonDto, 'comment'>,
  ): Observable<void> {
    return this.http.delete<void>(this.buildUrl(FLEET_VEHICLE_ACCESS_TO_ALL_DRIVERS_URL, fleetId, vehicleId), { body });
  }

  public getVehicleHistory(vehicleId: string, query: VehicleHistoryParamsDto): Observable<VehicleHistoryChangesDto> {
    const params = new HttpParams({ fromObject: query as unknown as Record<string, string | number> });
    const url = this.buildUrl(FLEET_VEHICLE_CHANGES_HISTORY, query.fleetId, vehicleId);
    return this.http.get<VehicleHistoryChangesDto>(url, { params }).pipe(catchError(() => of(null)));
  }

  public getVehicleHistoryInfo(
    fleetId: string,
    vehicleId: string,
    changeType: VehicleHistoryType,
    eventId: string,
  ): Observable<VehicleHistoryChangeItemDto> {
    const url = this.buildUrl(FLEET_VEHICLE_CHANGE_DETAILS, fleetId, vehicleId, changeType, eventId);
    return this.http.get<VehicleHistoryChangeItemDto>(url).pipe(catchError(() => of(null)));
  }

  public getLicensePlateById(vehicleId: string): Observable<VehicleBasicInfoDto> {
    return this.http.get<VehicleBasicInfoDto>(`api/fleets/null/vehicles/${vehicleId}/license-plate`);
  }
}
