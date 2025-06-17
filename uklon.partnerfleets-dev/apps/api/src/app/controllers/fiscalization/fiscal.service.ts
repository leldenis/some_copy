import { HttpControllerService } from '@api/common';
import { mapStatusToBoolean } from '@api/controllers/fiscalization/utils/map-status-to-boolean';
import { mapVehiclesWithCashPositions } from '@api/controllers/fiscalization/utils/map-vehicles-with-cash-positions';
import { VehiclesService } from '@api/controllers/vehicles/vehicles.service';
import { FiscalizationService } from '@api/datasource';
import { HttpSubCodeError } from '@constant';
import {
  FiscalizationStatusValue,
  FleetCashPointCollection,
  FleetCashPointDto,
  FleetCashPointStatusDto,
  FleetFiscalizationSettingsDto,
  FleetFiscalizationStatusDto,
  FleetFiscalizationStatusValueDto,
  FleetSignatureKeyDto,
  FleetSignatureKeyIdDto,
  FleetSignatureKeysCollection,
  FleetVehicleCashierPosDto,
  FleetVehicleCollectionDto,
  FleetVehicleCollectionQueryDto,
  FleetVehicleFiscalizationCollectionDto,
  FleetVehiclePointOfSaleDto,
  GatewayFleetCashPointCollection,
  GatewayFleetSignatureKeyCollection,
  GatewayFleetSignatureKeyDto,
} from '@data-access';
import { HttpStatus, Injectable } from '@nestjs/common';
import FormData from 'form-data';
import { forkJoin, map, mergeMap, Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { Jwt } from '@uklon/nest-core';

@Injectable()
export class FiscalService extends HttpControllerService {
  constructor(
    private readonly fiscalizationService: FiscalizationService,
    private readonly vehiclesService: VehiclesService,
  ) {
    super();
  }

  public getFleetFiscalizationSettings(token: Jwt, fleetId: string): Observable<FleetFiscalizationSettingsDto> {
    return this.fiscalizationService
      .get<FleetFiscalizationSettingsDto>(`api/v1/fleets/${fleetId}/fiscalization/settings`, { token })
      .pipe(
        catchError((error) => {
          if (
            error.response.status === HttpStatus.NOT_FOUND &&
            error.response?.data?.error?.sub_code === HttpSubCodeError.FISCALIZATION_SETTINGS_NOT_FOUND
          ) {
            return of(null);
          }
          return throwError(() => error);
        }),
      );
  }

  public updateFleetFiscalizationSettings(
    token: Jwt,
    fleetId: string,
    body: FleetFiscalizationSettingsDto,
  ): Observable<void> {
    return this.fiscalizationService.put<void>(`/api/v1/fleets/${fleetId}/fiscalization/settings`, body, {
      token,
    });
  }

  public getFleetFiscalizationStatus(token: Jwt, fleetId: string): Observable<FleetFiscalizationStatusDto> {
    return this.fiscalizationService
      .get<FleetFiscalizationStatusValueDto>(`api/v1/fleets/${fleetId}/fiscalization/status`, {
        token,
      })
      .pipe(
        map((data) => mapStatusToBoolean(data)),
        catchError((error) => {
          if (
            error.response.status === HttpStatus.NOT_FOUND &&
            error.response?.data?.error?.sub_code === HttpSubCodeError.FISCALIZATION_SETTINGS_NOT_FOUND
          ) {
            return of(null);
          }
          return throwError(() => error);
        }),
      );
  }

  public updateFleetFiscalizationStatus(
    token: Jwt,
    fleetId: string,
    body: FleetFiscalizationStatusDto,
  ): Observable<void> {
    return this.fiscalizationService.put<void>(
      `api/v1/fleets/${fleetId}/fiscalization/status`,
      { status: body.status ? FiscalizationStatusValue.ENABLED : FiscalizationStatusValue.DISABLED },
      {
        token,
      },
    );
  }

  public uploadFleetSignatureKeys(token: Jwt, fleetId: string, formData: FormData): Observable<FleetSignatureKeyIdDto> {
    return this.fiscalizationService.post<FleetSignatureKeyIdDto>(
      `/api/v1/fleets/${fleetId}/signature-keys`,
      formData,
      {
        token,
        headers: formData.getHeaders(),
      },
    );
  }

  public getFleetSignatureKeys(token: Jwt, fleetId: string): Observable<FleetSignatureKeysCollection> {
    return this.fiscalizationService
      .get<GatewayFleetSignatureKeyCollection>(`api/v1/fleets/${fleetId}/signature-keys`, {
        token,
      })
      .pipe(map((items) => items.map((item) => mapStatusToBoolean(item))));
  }

  public getFleetSignatureKeyById(token: Jwt, keyId: string): Observable<FleetSignatureKeyDto> {
    return this.fiscalizationService
      .get<GatewayFleetSignatureKeyDto>(`api/v1/signature-keys/${keyId}`, {
        token,
      })
      .pipe(map((item) => mapStatusToBoolean(item)));
  }

  public removeFleetSignatureKey(token: Jwt, keyId: string): Observable<void> {
    return this.fiscalizationService.delete<void>(`api/v1/signature-keys/${keyId}`, {
      token,
    });
  }

  public getFleetCashiersPos(token: Jwt, cashierId: string): Observable<GatewayFleetCashPointCollection> {
    return this.fiscalizationService.get<GatewayFleetCashPointCollection>(
      `/api/v1/tax-agency/cashiers/${cashierId}/pos`,
      {
        token,
      },
    );
  }

  public linkCashierToKey(token: Jwt, cashierId: string, body: FleetCashPointDto): Observable<void> {
    return this.fiscalizationService.post<void>(`/api/v1/cashiers/${cashierId}/pos`, body, { token });
  }

  public linkCashierToVehicle(token: Jwt, vehicleId: string, body: FleetVehiclePointOfSaleDto): Observable<void> {
    return this.fiscalizationService.post<void>(`/api/v1/vehicles/${vehicleId}/pos`, body, { token });
  }

  public removeCashierFromVehicle(token: Jwt, vehicleId: string): Observable<void> {
    return this.fiscalizationService.delete<void>(`/api/v1/vehicles/${vehicleId}/pos`, { token });
  }

  public getFleetPointsOfSale(token: Jwt, fleet_id: string): Observable<FleetCashPointCollection> {
    return this.fiscalizationService.get<FleetCashPointCollection>(`/api/v1/pos`, {
      token,
      params: { fleet_id },
    });
  }

  public getCashierPositionStatus(token: Jwt, posId: string): Observable<FleetCashPointStatusDto> {
    return this.fiscalizationService.get<FleetCashPointStatusDto>(`/api/v1/pos/${posId}/shift-status`, { token });
  }

  public getFleetVehiclePointOfSale(
    token: Jwt,
    fleetId: string,
    vehicleId: string,
  ): Observable<FleetVehicleCashierPosDto> {
    return this.getFleetPointsOfSale(token, fleetId).pipe(
      mergeMap((cashPoints) => {
        if (!cashPoints || cashPoints.length === 0) {
          return of(null);
        }

        const cashPointFound = cashPoints.find((point) => point.vehicles.some((vehicle) => vehicle.id === vehicleId));

        if (!cashPointFound) {
          return of(null);
        }

        return this.getCashierPositionStatus(token, cashPointFound.id).pipe(
          mergeMap((status) =>
            this.getFleetFiscalizationStatus(token, fleetId).pipe(
              map((data) => ({
                ...cashPointFound,
                status: status.status,
                fiscalStatus: data.status,
              })),
            ),
          ),
        ) as Observable<FleetVehicleCashierPosDto>;
      }),
    );
  }

  public getFleetFiscalizationVehicles(
    token: Jwt,
    fleetId: string,
    queryParams: FleetVehicleCollectionQueryDto,
  ): Observable<FleetVehicleFiscalizationCollectionDto> {
    const vehicles$: Observable<FleetVehicleCollectionDto> = this.vehiclesService.getFleetVehiclesV2(
      token,
      fleetId,
      queryParams,
    );
    return vehicles$.pipe(
      mergeMap(({ data: vehicles, total }) =>
        this.getFleetPointsOfSale(token, fleetId).pipe(
          mergeMap((cashPoints) => {
            if (!cashPoints || cashPoints.length === 0) {
              return of({ cashPointsWithStatus: [], vehicles, total });
            }

            return this.getCashPointsWithStatus(token, cashPoints).pipe(
              map((cashPointsWithStatus) => ({
                cashPointsWithStatus: cashPointsWithStatus.length > 0 ? cashPointsWithStatus : [],
                vehicles,
                total,
              })),
            );
          }),
          catchError(() => {
            return of({ cashPointsWithStatus: [], vehicles, total });
          }),
        ),
      ),
      map(({ cashPointsWithStatus, vehicles, total }) => ({
        data: mapVehiclesWithCashPositions(cashPointsWithStatus, vehicles),
        total,
      })),
    );
  }

  private getCashPointsWithStatus(
    token: Jwt,
    cashPoints: FleetCashPointCollection,
  ): Observable<FleetCashPointCollection> {
    const cashPoints$ = cashPoints.map((item) =>
      this.getCashierPositionStatus(token, item.id).pipe(
        map((status) => ({ ...item, status: status.status })),
        catchError(() => {
          return of({ ...item });
        }),
      ),
    );

    return forkJoin(cashPoints$);
  }
}
