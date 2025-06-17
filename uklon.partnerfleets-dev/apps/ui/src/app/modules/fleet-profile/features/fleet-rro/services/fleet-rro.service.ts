import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  FleetCashPointDto,
  GatewayFleetCashPointCollection,
  FleetFiscalizationSettingsDto,
  FleetFiscalizationStatusDto,
  FleetSignatureKeyDto,
  FleetSignatureKeyIdDto,
  FleetSignatureKeysCollection,
  FleetUploadSignatureKeysDto,
  FleetVehicleFiscalizationCollectionDto,
  FleetVehicleCollectionQueryDto,
  FleetVehiclePointOfSaleDto,
  FleetCashPointCollection,
  FleetVehicleCashierPosDto,
} from '@data-access';
import { HttpClientService } from '@ui/core/services/http-client.service';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class FleetRROService extends HttpClientService {
  constructor(private readonly http: HttpClient) {
    super();
  }

  public getFleetFiscalizationSetting(fleetId: string): Observable<FleetFiscalizationSettingsDto> {
    return this.http.get<FleetFiscalizationSettingsDto>(`api/fiscalization/${fleetId}/settings`);
  }

  public updateFleetFiscalizationSettings(fleetId: string, body: FleetFiscalizationSettingsDto): Observable<void> {
    return this.http.put<void>(`api/fiscalization/${fleetId}/settings`, body);
  }

  public getFleetFiscalizationStatus(fleetId: string): Observable<FleetFiscalizationStatusDto> {
    return this.http.get<FleetFiscalizationStatusDto>(`api/fiscalization/${fleetId}/status`);
  }

  public updateFleetFiscalizationStatus(fleetId: string, body: FleetFiscalizationStatusDto): Observable<void> {
    return this.http.put<void>(`api/fiscalization/${fleetId}/status`, body);
  }

  public uploadSignatureKeys(
    fleetId: string,
    file: File,
    data: FleetUploadSignatureKeysDto,
  ): Observable<FleetSignatureKeyIdDto> {
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);
    formData.append('password', data.password);
    formData.append('display_name', data.display_name);

    return this.http.post<FleetSignatureKeyIdDto>(`api/fiscalization/${fleetId}/signature-keys`, formData);
  }

  public getFleetSignatureKeys(fleetId: string): Observable<FleetSignatureKeysCollection> {
    return this.http.get<FleetSignatureKeysCollection>(`api/fiscalization/${fleetId}/signature-keys`);
  }

  public getSignatureKeyById(keyId: string): Observable<FleetSignatureKeyDto> {
    return this.http.get<FleetSignatureKeyDto>(`api/fiscalization/signature-keys/${keyId}`);
  }

  public removeSignatureKeyById(keyId: string): Observable<void> {
    return this.http.delete<void>(`api/fiscalization/signature-keys/${keyId}`);
  }

  public getFleetCashiersPos(fleetId: string, cashierId: string): Observable<GatewayFleetCashPointCollection> {
    return this.http.get<GatewayFleetCashPointCollection>(`api/fiscalization/${fleetId}/cashiers/${cashierId}/pos`);
  }

  public getFleetPointsOfSale(fleetId: string): Observable<FleetCashPointCollection> {
    return this.http.get<FleetCashPointCollection>(`api/fiscalization/${fleetId}/points-of-sale`);
  }

  public linkCashierToKey(cashierId: string, body: FleetCashPointDto): Observable<void> {
    return this.http.post<void>(`api/fiscalization/cashiers/${cashierId}/pos`, body);
  }

  public linkCashierToVehicle(vehicleId: string, body: FleetVehiclePointOfSaleDto): Observable<void> {
    return this.http.post<void>(`api/fiscalization/vehicles/${vehicleId}/pos`, body);
  }

  public removeCashierFromVehicle(vehicleId: string): Observable<void> {
    return this.http.delete<void>(`api/fiscalization/vehicles/${vehicleId}/pos`);
  }

  public getFleetVehiclesFiscalization(
    fleetId: string,
    query: FleetVehicleCollectionQueryDto,
  ): Observable<FleetVehicleFiscalizationCollectionDto> {
    return this.http.get<FleetVehicleFiscalizationCollectionDto>(`api/fiscalization/${fleetId}/vehicles`, {
      params: { ...query },
    });
  }

  public getFleetVehiclePointOfSale(fleetId: string, vehicleId: string): Observable<FleetVehicleCashierPosDto> {
    return this.http.get<FleetVehicleCashierPosDto>(`api/fiscalization/${fleetId}/vehicles/${vehicleId}/point-of-sale`);
  }
}
