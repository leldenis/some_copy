import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { PhotoSize } from '@constant';
import {
  DriverProductConfigurationsCollectionDto,
  DriverRideConditionListDto,
  FleetDriverDto,
  FleetDriversCollection,
  FleetDto,
  PhotosDto,
} from '@data-access';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { CorePaths } from '@ui/core/models/core-paths';
import { DriverService } from '@ui/core/services/datasource/driver.service';
import { ToastService } from '@ui/core/services/toast.service';
import { accountActions } from '@ui/core/store/account/account.actions';
import { selectedFleetId } from '@ui/core/store/account/account.selectors';
import { AppState } from '@ui/core/store/app.state';
import { getRouterUrl } from '@ui/core/store/router/router.selector';
import { getFleetDriverDetails, getIsDriverDetailsPages } from '@ui/modules/drivers/store';
import { driversActions } from '@ui/modules/drivers/store/drivers/drivers.actions';
import { DriversState } from '@ui/modules/drivers/store/drivers/drivers.reducer';
import { VehiclesService } from '@ui/modules/vehicles/services/vehicles.service';
import { vehiclesActions, VehiclesState } from '@ui/modules/vehicles/store';
import { DEFAULT_CONFIRMATION_MAT_DIALOG_CONFIG } from '@ui/shared/consts';
import { UnlinkDriverVehicleComponent } from '@ui/shared/dialogs/unlink-driver-vehicle/unlink-driver-vehicle.component';
import { FleetErrorMessage } from '@ui/shared/enums';
import { exhaustMap, map, of } from 'rxjs';
import { switchMap, tap, catchError, concatAll, withLatestFrom, filter, take } from 'rxjs/operators';

@Injectable()
export class DriversEffects {
  public getFleetDrivers$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(driversActions.getFleetDrivers),
        switchMap(({ name, phone, status, block_status, ...payload }) => {
          return this.driversService
            .getFleetDrivers(
              payload?.fleetId,
              { name, phone, status, block_status },
              payload?.limit,
              payload?.offset,
              payload?.region_id,
            )
            .pipe(
              tap((driversCollection: FleetDriversCollection) => {
                this.driversStore.dispatch(driversActions.getFleetDriversSuccess(driversCollection));
              }),
              catchError(() => {
                this.driversStore.dispatch(driversActions.getFleetDriversFailed());
                return of(null);
              }),
            );
        }),
      ),
    { dispatch: false },
  );

  public getFleetDriverById$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(driversActions.getFleetDriverById),
        switchMap((payload) =>
          this.driversService.getFleetDriverById(payload.fleetId, payload.driverId).pipe(
            tap((driverDetails: FleetDriverDto) => {
              this.driversStore.dispatch(driversActions.getFleetDriverByIdSuccess(driverDetails));
            }),
            catchError(() => {
              this.driversStore.dispatch(driversActions.getFleetDriverByIdFailed());
              return of(null);
            }),
          ),
        ),
      ),
    { dispatch: false },
  );

  public getFleetDriverByIdSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(driversActions.getFleetDriverByIdSuccess),
        withLatestFrom(this.store.select(selectedFleetId)),
        tap(([driverDetails, fleetId]: [FleetDriverDto, string]) => {
          if (driverDetails?.selected_vehicle?.vehicle_id && driverDetails?.selected_vehicle?.currentFleet) {
            this.driversStore.dispatch(driversActions.getDriverRideConditions());
            this.vehiclesStore.dispatch(
              vehiclesActions.getFleetVehiclePhotos({
                fleetId,
                vehicleId: driverDetails?.selected_vehicle?.vehicle_id,
                image_size: PhotoSize.SMALL,
              }),
            );
          }
        }),
      ),
    { dispatch: false },
  );

  public getDriverRideConditions = createEffect(() =>
    this.actions$.pipe(
      ofType(driversActions.getDriverRideConditions),
      withLatestFrom(this.driversStore.select(getFleetDriverDetails), this.store.select(selectedFleetId)),
      switchMap(([_, driver, fleetId]) =>
        this.driversService.getDriverRideCondition(fleetId, driver.id).pipe(
          map((response: DriverRideConditionListDto) => driversActions.getDriverRideConditionsSuccess(response)),
          catchError(() => {
            this.driversStore.dispatch(driversActions.getDriverRideConditionsFailed());
            return of(null);
          }),
        ),
      ),
    ),
  );

  public openUnlinkDriverVehicleDialog$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(driversActions.openUnlinkVehicleDialog),
        withLatestFrom(this.driversStore.select(getFleetDriverDetails), this.store.select(selectedFleetId)),
        tap(([_, driver, fleetId]) => {
          const dialogRef = this.matDialog.open(UnlinkDriverVehicleComponent, {
            ...DEFAULT_CONFIRMATION_MAT_DIALOG_CONFIG,
            data: {
              type: 'vehicle',
              placeholder: `${driver?.selected_vehicle?.make} ${driver?.selected_vehicle?.model} ${driver?.selected_vehicle?.license_plate}`,
            },
          });

          dialogRef
            .afterClosed()
            .pipe(take(1), filter(Boolean))
            .subscribe(() => {
              this.vehiclesStore.dispatch(
                driversActions.releaseFleetDriverVehicleById({
                  vehicleId: driver.selected_vehicle.vehicle_id,
                  fleetId,
                }),
              );
            });
        }),
      ),
    { dispatch: false },
  );

  public releaseFleetDriverVehicleById$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(driversActions.releaseFleetDriverVehicleById),
        switchMap((payload) =>
          this.vehiclesService.releaseFleetVehicleById(payload.fleetId, payload.vehicleId).pipe(
            tap(() => {
              this.vehiclesStore.dispatch(driversActions.releaseFleetDriverVehicleByIdSuccess());
              this.toastService.success('Notification.ReleaseVehicle.Success');
            }),
            catchError((err) => {
              this.vehiclesStore.dispatch(driversActions.releaseFleetDriverVehicleByIdFailed());
              this.toastService.error(
                err?.status === 400 ? 'Notification.ReleaseVehicle.InvalidError' : 'Notification.ReleaseVehicle.Error',
              );
              return of(null);
            }),
          ),
        ),
      ),
    { dispatch: false },
  );

  public releaseFleetDriverVehicleByIdSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(driversActions.releaseFleetDriverVehicleByIdSuccess),
      withLatestFrom(this.driversStore.select(getFleetDriverDetails), this.store.select(selectedFleetId)),
      map(([_, driver, fleetId]) =>
        driversActions.getFleetDriverById({
          fleetId,
          driverId: driver.id,
        }),
      ),
    ),
  );

  public getFleetVehiclePhotos$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(driversActions.getFleetDriverPhotos),
        switchMap((payload) =>
          this.driversService.getFleetDriverPhotos(payload.driverId, payload.image_size).pipe(
            tap((vehiclePhotos: PhotosDto) => {
              payload.image_size === PhotoSize.LARGE
                ? this.driversStore.dispatch(driversActions.getFleetDriverPhotosLgSuccess(vehiclePhotos))
                : this.driversStore.dispatch(driversActions.getFleetDriverPhotosSuccess(vehiclePhotos));
            }),
            catchError(() => {
              payload.image_size === PhotoSize.LARGE
                ? this.driversStore.dispatch(driversActions.getFleetDriverPhotosLgFailed())
                : this.driversStore.dispatch(driversActions.getFleetDriverPhotosFailed());
              return of(null);
            }),
          ),
        ),
      ),
    { dispatch: false },
  );

  public removeFleetDriverById$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(driversActions.removeFleetDriverById),
        exhaustMap((payload) =>
          this.driversService.removeFleetDriverById(payload.fleetId, payload.driverId, payload.body).pipe(
            tap(() => {
              this.driversStore.dispatch(driversActions.removeFleetDriverByIdSuccess());
              this.toastService.success('Notification.Drivers.RemoveDriverSuccess');
            }),
            catchError(({ error }) => {
              this.driversStore.dispatch(driversActions.removeFleetDriverByIdFailed());

              this.toastService.error(
                error?.message === FleetErrorMessage.DRIVER_HAS_CONNECTED_VEHICLE
                  ? `Notification.Drivers.DriverHasSelectedVehicle`
                  : 'Common.Error.TemporarilyUnavailable',
              );

              return of(null);
            }),
          ),
        ),
      ),
    { dispatch: false },
  );

  public removeFleetDriverByIdSuccess$ = createEffect(
    () => this.actions$.pipe(ofType(driversActions.removeFleetDriverByIdSuccess)),
    { dispatch: false },
  );

  public getFleetDriverProductsConfigurations$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(driversActions.getFleetDriverProductsConfigurations),
        switchMap((payload) =>
          this.driversService.getFleetDriverProductsConfigurations(payload.fleetId, payload.driverId).pipe(
            tap((productsConfigurationsCollection: DriverProductConfigurationsCollectionDto) => {
              this.driversStore.dispatch(
                driversActions.getFleetDriverProductsConfigurationsSuccess(productsConfigurationsCollection),
              );
            }),
            catchError(() => {
              this.driversStore.dispatch(driversActions.getFleetDriverProductsConfigurationsFailed());
              return of(null);
            }),
          ),
        ),
      ),
    { dispatch: false },
  );

  public putFleetDriverProductsConfigurations$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(driversActions.putFleetDriverProductsConfigurations),
        exhaustMap((payload) =>
          this.driversService
            .updateFleetDriverProductConfigurations(payload.fleetId, payload.driverId, payload.body)
            .pipe(
              tap(() => {
                this.driversStore.dispatch(driversActions.putFleetDriverProductsConfigurationsSuccess());
                this.driversStore.dispatch(
                  driversActions.getFleetDriverProductsConfigurations({
                    fleetId: payload.fleetId,
                    driverId: payload.driverId,
                  }),
                );
              }),
              catchError(() => {
                this.driversStore.dispatch(driversActions.putFleetDriverProductsConfigurationsFailed());
                return of(null);
              }),
            ),
        ),
      ),
    { dispatch: false },
  );

  public putFleetDriverProductConfigurationsById$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(driversActions.putFleetDriverProductConfigurationsById),
        exhaustMap((payload) =>
          this.driversService
            .updateFleetDriverProductConfigurationsById(
              payload.fleetId,
              payload.driverId,
              payload.productId,
              payload.body,
            )
            .pipe(
              tap(() => {
                this.driversStore.dispatch(driversActions.putFleetDriverProductConfigurationsByIdSuccess());
              }),
              catchError(() => {
                this.driversStore.dispatch(driversActions.putFleetDriverProductConfigurationsByIdFailed());
                return of(null);
              }),
            ),
        ),
      ),
    { dispatch: false },
  );

  public bulkPutFleetDriverProductConfigurationsById$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(driversActions.bulkPutFleetDriverProductConfigurationsById),
        exhaustMap((payload) =>
          payload.body.map((product) =>
            this.driversService.updateFleetDriverProductConfigurationsById(
              payload.fleetId,
              payload.driverId,
              product.id,
              product.configuration,
            ),
          ),
        ),
        concatAll(),
        tap(() => {
          this.driversStore.dispatch(driversActions.bulkPutFleetDriverProductConfigurationsByIdSuccess());
        }),
        // eslint-disable-next-line rxjs/no-unsafe-catch
        catchError(() => {
          this.driversStore.dispatch(driversActions.bulkPutFleetDriverProductConfigurationsByIdFailed());
          return of(null);
        }),
      ),
    { dispatch: false },
  );

  public bulkPutFleetDriverProductConfigurationsByIdSuccess$ = createEffect(
    () => this.actions$.pipe(ofType(driversActions.bulkPutFleetDriverProductConfigurationsByIdSuccess)),
    { dispatch: false },
  );

  public putFleetDriverProductsConfigurationsSuccess$ = createEffect(
    () => this.actions$.pipe(ofType(driversActions.putFleetDriverProductsConfigurationsSuccess)),
    { dispatch: false },
  );

  public setSelectedFleetFromMenu$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(accountActions.setSelectedFleetFromMenu),
        withLatestFrom(this.store.select(getIsDriverDetailsPages), this.store.select(getRouterUrl)),
        filter(
          ([_, isDriverPages, currentUrl]: [FleetDto, boolean, string]) =>
            isDriverPages && coerceBooleanProperty(currentUrl),
        ),
        map(([fleet, _, currentUrl]: [FleetDto, boolean, string]) => {
          const segments = currentUrl.split('/');
          const lastIndexOfPage = segments.findIndex((item) => item.includes(CorePaths.DRIVERS));
          segments.splice(lastIndexOfPage + 1);

          this.router.navigate(segments).then(() => {
            this.store.dispatch(accountActions.setSelectedFleet(fleet));
          });
        }),
      ),
    { dispatch: false },
  );

  public getFleetDriverDenyList$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(driversActions.getFleetDriverDenyList),
        switchMap(({ driverId }) =>
          this.driversService.getDriverDenyList(driverId).pipe(
            tap((denyList) => {
              this.driversStore.dispatch(driversActions.getFleetDriverDenyListSuccess(denyList));
            }),
            catchError(() => {
              this.driversStore.dispatch(driversActions.getFleetDriverDenyListError());
              return of(null);
            }),
          ),
        ),
      ),
    { dispatch: false },
  );

  public clearFleetDriverDenyList$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(driversActions.clearFleetDriverDenyList),
        switchMap(({ driverId }) =>
          this.driversService.clearDriverDenyList(driverId).pipe(
            tap(() => {
              this.driversStore.dispatch(driversActions.clearFleetDriverDenyListSuccess());
              this.toastService.success(this.translateService.instant('DenyList.ClearSuccess'));
            }),
            catchError(() => {
              this.driversStore.dispatch(driversActions.clearFleetDriverDenyListError());
              return of(null);
            }),
          ),
        ),
      ),
    { dispatch: false },
  );

  public getFleetDriverRestrictions$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(driversActions.getFleetDriverRestrictions),
        switchMap(({ fleetId, driverId }) =>
          this.driversService.getRestrictions(fleetId, driverId).pipe(
            tap((restrictions) =>
              this.driversStore.dispatch(driversActions.getFleetDriverRestrictionsSuccess(restrictions)),
            ),
            catchError(() => {
              this.driversStore.dispatch(driversActions.getFleetDriverRestrictionsError());
              return of(null);
            }),
          ),
        ),
      ),
    { dispatch: false },
  );

  constructor(
    private readonly actions$: Actions,
    private readonly driversService: DriverService,
    private readonly driversStore: Store<DriversState>,
    private readonly vehiclesStore: Store<VehiclesState>,
    private readonly store: Store<AppState>,
    private readonly toastService: ToastService,
    private readonly translateService: TranslateService,
    private readonly router: Router,
    private readonly matDialog: MatDialog,
    private readonly vehiclesService: VehiclesService,
  ) {}
}
