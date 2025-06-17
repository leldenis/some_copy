import { Inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { PhotoSize } from '@constant';
import {
  FleetDto,
  FleetRole,
  FleetVehicleCashierPosDto,
  FleetVehicleCollectionQueryDto,
  FleetVehicleWithFiscalizationUnlinkDto,
  PaginationCollectionDto,
  PhotosDto,
  TicketDto,
  VehicleDetailsDto,
  VehicleProductConfigurationCollectionDto,
  VehicleTicketDto,
  VehicleTicketUpdateDto,
  WithdrawalType,
} from '@data-access';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { CorePaths } from '@ui/core/models/core-paths';
import { ToastService } from '@ui/core/services/toast.service';
import { accountActions } from '@ui/core/store/account/account.actions';
import { getSelectedFleet, selectedFleetId } from '@ui/core/store/account/account.selectors';
import { AppState } from '@ui/core/store/app.state';
import { getRouterUrl } from '@ui/core/store/router/router.selector';
import { driversActions, DriversState } from '@ui/modules/drivers/store';
import { FinanceService } from '@ui/modules/finance/services';
import { UnlinkCashFromVehicleComponent } from '@ui/modules/fleet-profile/features/fleet-rro/components/unlink-cash-from-vehicle/unlink-cash-from-vehicle.component';
import { FleetRROService } from '@ui/modules/fleet-profile/features/fleet-rro/services';
import { VehiclePaths } from '@ui/modules/vehicles/models/vehicle-paths';
import { TicketsService } from '@ui/modules/vehicles/services/tickets.service';
import { VehiclesService } from '@ui/modules/vehicles/services/vehicles.service';
import {
  getFleetVehicleDetails,
  getFleetVehicleDetailsId,
  getIsVehicleCreatePage,
  getIsVehicleDetailsPage,
  getIsVehicleTicketPage,
} from '@ui/modules/vehicles/store';
import { vehiclesActions } from '@ui/modules/vehicles/store/vehicles/vehicles.actions';
import { VehiclesState } from '@ui/modules/vehicles/store/vehicles/vehicles.reducer';
import { FleetErrorMessage } from '@ui/shared/enums';
import _ from 'lodash';
import { exhaustMap, of } from 'rxjs';
import { catchError, filter, map, switchMap, take, tap, withLatestFrom } from 'rxjs/operators';

import { WINDOW } from '@uklon/angular-core';

@Injectable()
export class VehiclesEffects {
  public getFleetVehicles$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(vehiclesActions.getFleetVehicles),
        withLatestFrom(this.store.select(selectedFleetId)),
        switchMap(([payload, fleetId]: [FleetVehicleCollectionQueryDto, string]) => {
          const params = _(payload)
            .omit('fleetId', 'type')
            .omitBy(_.isNil)
            .omitBy(_.isUndefined)
            .omitBy((value) => value === '')
            .value() as FleetVehicleCollectionQueryDto;
          return this.vehiclesService.getFleetVehicles(fleetId, params).pipe(
            tap((collection) => {
              this.vehiclesStore.dispatch(vehiclesActions.getFleetVehiclesSuccess(collection));
            }),
            catchError(() => {
              this.vehiclesStore.dispatch(vehiclesActions.getFleetVehiclesFailed());
              return of(null);
            }),
          );
        }),
      ),
    { dispatch: false },
  );

  public getFleetVehicleById$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(vehiclesActions.getFleetVehicleById),
        switchMap((payload) =>
          this.vehiclesService.getFleetVehicleById(payload.fleetId, payload.vehicleId).pipe(
            tap((vehicleDetails: VehicleDetailsDto) => {
              this.vehiclesStore.dispatch(vehiclesActions.getFleetVehicleByIdSuccess({ vehicleDetails }));
            }),
            catchError(() => {
              this.vehiclesStore.dispatch(vehiclesActions.getFleetVehicleByIdFailed());
              return of(null);
            }),
          ),
        ),
      ),
    { dispatch: false },
  );

  public getFleetVehicleByIdSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(vehiclesActions.getFleetVehicleByIdSuccess),
        tap(({ vehicleDetails }) => {
          if (vehicleDetails?.selected_by_driver?.driver_id) {
            this.driversStore.dispatch(
              driversActions.getFleetDriverPhotos({
                driverId: vehicleDetails?.selected_by_driver?.driver_id,
                image_size: PhotoSize.SMALL,
              }),
            );
          }
        }),
        withLatestFrom(this.store.select(getSelectedFleet)),
        switchMap(([{ vehicleDetails }, selectedFleet]) => {
          return this.financeService.getFleetEntrepreneurs(selectedFleet.id).pipe(
            filter((data) =>
              Boolean(
                selectedFleet.is_fiscalization_enabled &&
                  selectedFleet.role === FleetRole.OWNER &&
                  data.items.length > 0 &&
                  data.withdrawal_type === WithdrawalType.INDIVIDUAL_ENTREPRENEUR,
              ),
            ),
            tap(() => {
              this.vehiclesStore.dispatch(
                vehiclesActions.getFleetVehiclePointOfSale({ fleetId: selectedFleet.id, vehicleId: vehicleDetails.id }),
              );
            }),
          );
        }),
      ),
    { dispatch: false },
  );

  public getFleetVehiclePointOfSale$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(vehiclesActions.getFleetVehiclePointOfSale),
        switchMap((payload) =>
          this.fleetRROService.getFleetVehiclePointOfSale(payload.fleetId, payload.vehicleId).pipe(
            tap((cashPoint: FleetVehicleCashierPosDto) => {
              this.vehiclesStore.dispatch(vehiclesActions.getFleetVehiclePointOfSaleSuccess({ cashPoint }));
            }),
            catchError(() => {
              this.vehiclesStore.dispatch(vehiclesActions.getFleetVehiclePointOfSaleFailed());
              return of(null);
            }),
          ),
        ),
      ),
    { dispatch: false },
  );

  public openUnLinkCashPointFromVehicleModal$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(vehiclesActions.openUnlinkCashPointFromVehicleModal),
        withLatestFrom(this.store.select(getFleetVehicleDetails), this.store.select(selectedFleetId)),
        tap(([{ point }, vehicleDetails, fleetId]) => {
          const data: FleetVehicleWithFiscalizationUnlinkDto = {
            vehicle: {
              id: vehicleDetails.id,
              name: `${vehicleDetails.license_plate} ${vehicleDetails.make} ${vehicleDetails.model}`,
            },
            cashierPos: point,
          };
          this.matDialog
            .open(UnlinkCashFromVehicleComponent, {
              panelClass: 'mat-dialog-no-padding',
              disableClose: false,
              data: {
                ...data,
              },
            })
            .afterClosed()
            .pipe(take(1))
            .subscribe((response) => {
              if (response) {
                this.store.dispatch(vehiclesActions.getFleetVehicleById({ fleetId, vehicleId: vehicleDetails.id }));
                this.toastService.success('FleetProfile.RRO.Modals.UnLinkCashFromVehicle.Notification.Success');
              }
            });
        }),
      ),
    { dispatch: false },
  );

  public getFleetVehicleProductConfigurations$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(vehiclesActions.getFleetVehicleProductConfigurations),
        switchMap((payload) =>
          this.vehiclesService.getFleetVehicleProductConfigurations(payload.fleetId, payload.vehicleId).pipe(
            tap((productConfigurations: VehicleProductConfigurationCollectionDto) => {
              this.vehiclesStore.dispatch(
                vehiclesActions.getFleetVehicleProductConfigurationsSuccess(productConfigurations),
              );
            }),
            catchError(() => {
              this.vehiclesStore.dispatch(vehiclesActions.getFleetVehicleProductConfigurationsFailed());
              return of(null);
            }),
          ),
        ),
      ),
    { dispatch: false },
  );

  public updateFleetVehicleProductConfigurations$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(vehiclesActions.updateFleetVehicleProductConfigurations),
        exhaustMap((payload) =>
          this.vehiclesService
            .updateFleetVehicleProductConfigurations(payload.fleetId, payload.vehicleId, payload.body)
            .pipe(
              tap(() => {
                this.vehiclesStore.dispatch(vehiclesActions.updateFleetVehicleProductConfigurationsSuccess());
                this.vehiclesStore.dispatch(
                  vehiclesActions.getFleetVehicleProductConfigurations({
                    fleetId: payload.fleetId,
                    vehicleId: payload.vehicleId,
                  }),
                );
              }),
              catchError(() => {
                this.vehiclesStore.dispatch(vehiclesActions.updateFleetVehicleProductConfigurationsFailed());
                return of(null);
              }),
            ),
        ),
      ),
    { dispatch: false },
  );

  public deleteFleetVehicleById$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(vehiclesActions.deleteFleetVehicleById),
        exhaustMap((payload) =>
          this.vehiclesService.deleteFleetVehicleById(payload.fleetId, payload.vehicleId, payload.body).pipe(
            tap(() => {
              this.vehiclesStore.dispatch(vehiclesActions.deleteFleetVehicleByIdSuccess());
              this.toastService.success('Notification.Vehicles.RemoveVehicleSuccess');
            }),
            catchError(({ error }) => {
              this.vehiclesStore.dispatch(vehiclesActions.deleteFleetVehicleByIdFailed());
              if (error.message === FleetErrorMessage.VEHICLE_HAS_CONNECTED_DRIVER) {
                this.toastService.error('Notification.Vehicles.RemoveVehicleError');
              } else {
                this.toastService.error('Common.Error.TemporarilyUnavailable');
              }
              return of(null);
            }),
          ),
        ),
      ),
    { dispatch: false },
  );

  public deleteFleetVehicleByIdSuccess$ = createEffect(
    () => this.actions$.pipe(ofType(vehiclesActions.deleteFleetVehicleByIdSuccess)),
    { dispatch: false },
  );

  public postFleetVehicleById$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(vehiclesActions.postFleetVehicleById),
        exhaustMap((payload) =>
          this.ticketsService.postFleetVehicleById(payload.fleetId, payload.vehicleId, payload.body).pipe(
            tap(() => {
              this.vehiclesStore.dispatch(
                vehiclesActions.postFleetVehicleByIdSuccess({
                  license_plate: payload.body.license_plate,
                }),
              );
            }),
            catchError(() => {
              this.vehiclesStore.dispatch(vehiclesActions.postFleetVehicleByIdFailed());
              return of(null);
            }),
          ),
        ),
      ),
    { dispatch: false },
  );

  public postFleetVehicleByIdSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(vehiclesActions.postFleetVehicleByIdSuccess),
        tap(({ license_plate }: { license_plate: string }) =>
          this.toastService.success('Vehicles.Creation.Notify.Success', { carNumber: license_plate }, 5000),
        ),
      ),
    { dispatch: false },
  );

  public postFleetVehicleTicketById$ = createEffect(() =>
    this.actions$.pipe(
      ofType(vehiclesActions.postFleetVehicleTicketById),
      exhaustMap((payload) =>
        this.ticketsService.postFleetVehicleById(payload.fleetId, payload.vehicleId, payload.body).pipe(
          map(() => vehiclesActions.postFleetVehicleTicketByIdSuccess({ tiket_id: payload.body.tiket_id })),
          catchError(() => {
            this.vehiclesStore.dispatch(vehiclesActions.postFleetVehicleTicketByIdFailed());
            return of(null);
          }),
        ),
      ),
    ),
  );

  public postFleetVehicleTicketByIdSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(vehiclesActions.postFleetVehicleTicketByIdSuccess),
        tap(() => this.toastService.success('Vehicles.Creation.Notify.SimpleTicketSuccess', 5000)),
      ),

    { dispatch: false },
  );

  public releaseFleetVehicleById$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(vehiclesActions.releaseFleetVehicleById),
        switchMap((payload) =>
          this.vehiclesService.releaseFleetVehicleById(payload.fleetId, payload.vehicleId).pipe(
            tap(() => {
              this.vehiclesStore.dispatch(vehiclesActions.releaseFleetVehicleByIdSuccess());
              this.toastService.success('Notification.ReleaseVehicle.Success');
            }),
            catchError((err) => {
              this.vehiclesStore.dispatch(vehiclesActions.releaseFleetVehicleByIdFailed());
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

  public releaseFleetVehicleByIdSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(vehiclesActions.releaseFleetVehicleByIdSuccess),
        withLatestFrom(this.store.select(selectedFleetId), this.vehiclesStore.select(getFleetVehicleDetailsId)),
        // eslint-disable-next-line @typescript-eslint/no-shadow
        tap(([_, fleetId, vehicleId]) => {
          this.vehiclesStore.dispatch(vehiclesActions.getFleetVehicleById({ fleetId, vehicleId }));
        }),
      ),
    { dispatch: false },
  );

  public getFleetVehiclePhotos$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(vehiclesActions.getFleetVehiclePhotos),
        switchMap((payload) =>
          this.vehiclesService.getFleetVehiclePhotos(payload.fleetId, payload.vehicleId, payload.image_size).pipe(
            tap((vehiclePhotos: PhotosDto) => {
              payload.image_size === PhotoSize.LARGE
                ? this.vehiclesStore.dispatch(vehiclesActions.getFleetVehiclePhotosLgSuccess(vehiclePhotos))
                : this.vehiclesStore.dispatch(vehiclesActions.getFleetVehiclePhotosSuccess(vehiclePhotos));
            }),
            catchError(() => {
              payload.image_size === PhotoSize.LARGE
                ? this.vehiclesStore.dispatch(vehiclesActions.getFleetVehiclePhotosLgFailed())
                : this.vehiclesStore.dispatch(vehiclesActions.getFleetVehiclePhotosFailed());
              return of(null);
            }),
          ),
        ),
      ),
    { dispatch: false },
  );

  public getVehicleTicketPhotos$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(vehiclesActions.getVehicleTicketPhotos),
        switchMap((payload) =>
          this.ticketsService.getVehicleTicketPhotos(payload.ticketId, payload.image_size).pipe(
            tap((photos: PhotosDto) => {
              payload.image_size === PhotoSize.LARGE
                ? this.vehiclesStore.dispatch(vehiclesActions.getVehicleTicketPhotosLgSuccess({ photos }))
                : this.vehiclesStore.dispatch(vehiclesActions.getVehicleTicketPhotosSuccess({ photos }));
            }),
            catchError(() => {
              payload.image_size === PhotoSize.LARGE
                ? this.vehiclesStore.dispatch(vehiclesActions.getVehicleTicketPhotosLgFailed())
                : this.vehiclesStore.dispatch(vehiclesActions.getVehicleTicketPhotosFailed());
              return of(null);
            }),
          ),
        ),
      ),
    { dispatch: false },
  );

  public getFleetVehiclesTickets$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(vehiclesActions.getFleetVehiclesTickets),
        switchMap((payload) =>
          this.ticketsService
            .getFleetVehiclesTickets(
              payload?.fleetId,
              payload?.license_plate,
              payload?.status,
              payload?.offset,
              payload?.limit,
            )
            .pipe(
              tap((fleetVehiclesTicketsCollection: PaginationCollectionDto<VehicleTicketDto>) => {
                this.vehiclesStore.dispatch(
                  vehiclesActions.getFleetVehiclesTicketsSuccess(fleetVehiclesTicketsCollection),
                );
              }),
              catchError(() => {
                this.vehiclesStore.dispatch(vehiclesActions.getFleetVehiclesTicketsFailed());
                return of(null);
              }),
            ),
        ),
      ),
    { dispatch: false },
  );

  public updateFleetVehicleCreationTicket$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(vehiclesActions.updateFleetVehiclesCreationTicket),
        exhaustMap((payload: { ticketId: string; form: Partial<VehicleTicketUpdateDto>; skipSendStatus?: boolean }) =>
          this.ticketsService.updateFleetVehiclesCreationTicket(payload.ticketId, payload.form).pipe(
            tap(() => {
              this.vehiclesStore.dispatch(vehiclesActions.updateFleetVehiclesCreationTicketSuccess());
              if (!payload?.skipSendStatus) {
                this.vehiclesStore.dispatch(
                  vehiclesActions.setVehicleCreationTicketSentStatus({ tiket_id: payload.ticketId }),
                );
              }
            }),
            catchError(() => {
              this.vehiclesStore.dispatch(vehiclesActions.updateFleetVehiclesCreationTicketFailed());
              return of(null);
            }),
          ),
        ),
      ),
    { dispatch: false },
  );

  public setVehicleCreationTicketSentStatus$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(vehiclesActions.setVehicleCreationTicketSentStatus),
        exhaustMap((payload: TicketDto) =>
          this.ticketsService.setVehicleCreationTicketSentStatus({ tiket_id: payload.tiket_id }).pipe(
            tap(() => {
              this.vehiclesStore.dispatch(vehiclesActions.setVehicleCreationTicketSentStatusSuccess());
            }),
            catchError(() => {
              this.vehiclesStore.dispatch(vehiclesActions.setVehicleCreationTicketSentStatusFailed());
              return of(null);
            }),
          ),
        ),
      ),
    { dispatch: false },
  );

  public setVehicleCreationTicketSentStatusSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(vehiclesActions.setVehicleCreationTicketSentStatusSuccess),
        tap(async () => this.router.navigate([`${CorePaths.WORKSPACE}/${CorePaths.VEHICLES}`], { fragment: '1' })),
      ),
    { dispatch: false },
  );

  public setVehicleCreationTicketSentStatusFailed$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(vehiclesActions.setVehicleCreationTicketSentStatusFailed),
        tap(() => {
          this.toastService.warn('Vehicles.Creation.Notify.Warning', 5000);
        }),
      ),
    { dispatch: false },
  );

  public deleteTicket$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(vehiclesActions.deleteTicket),
        exhaustMap((payload: { ticketId: string }) =>
          this.ticketsService.deleteTicket(payload.ticketId).pipe(
            tap(() => {
              this.vehiclesStore.dispatch(vehiclesActions.deleteTicketSuccess());
            }),
            catchError(() => {
              this.vehiclesStore.dispatch(vehiclesActions.deleteTicketFailed());
              return of(null);
            }),
          ),
        ),
      ),
    { dispatch: false },
  );

  public clearVehicleDetailsPageState$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(vehiclesActions.clearVehicleDetailsPage),
        tap(() => {
          this.vehiclesStore.dispatch(vehiclesActions.getFleetVehicleByIdFailed());
          this.vehiclesStore.dispatch(vehiclesActions.clearFleetVehiclePhotos());
          this.vehiclesStore.dispatch(vehiclesActions.clearVehicleCashPoint());
          this.driversStore.dispatch(driversActions.clearFleetDriverPhotos());
        }),
      ),
    { dispatch: false },
  );

  public setSelectedFleetFromMenu$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(accountActions.setSelectedFleetFromMenu),
        withLatestFrom(this.vehiclesStore.select(getIsVehicleDetailsPage), this.store.select(getRouterUrl)),
        filter(
          // eslint-disable-next-line @typescript-eslint/no-shadow
          ([_, isVehicleDetailsPages, currentUrl]: [FleetDto, boolean, string]) =>
            isVehicleDetailsPages && !!currentUrl,
        ),
        // eslint-disable-next-line @typescript-eslint/no-shadow
        map(([fleet, _, _currentUrl]: [FleetDto, boolean, string]) => {
          this.router.navigate([`/${CorePaths.WORKSPACE}/${CorePaths.VEHICLES}`]).then(() => {
            this.store.dispatch(accountActions.setSelectedFleet(fleet));
            this.vehiclesStore.dispatch(vehiclesActions.clearVehicleDetailsPage());
            this.vehiclesStore.dispatch(vehiclesActions.clearState());
          });
        }),
      ),
    { dispatch: false },
  );

  public setSelectedFleetFromMenuCreatePage$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(accountActions.setSelectedFleetFromMenu),
        withLatestFrom(this.vehiclesStore.select(getIsVehicleCreatePage)),
        // eslint-disable-next-line @typescript-eslint/no-shadow
        filter(([_, isVehicleCreatePage]: [FleetDto, boolean]) => isVehicleCreatePage),
        // eslint-disable-next-line @typescript-eslint/no-shadow
        map(([fleet, _]: [FleetDto, boolean]) => {
          this.router.navigate([`/${CorePaths.WORKSPACE}/${CorePaths.VEHICLES}/${VehiclePaths.CREATE}`]).then(() => {
            this.store.dispatch(accountActions.setSelectedFleet(fleet));
            this.window.location.reload();
          });
        }),
      ),
    { dispatch: false },
  );

  public setSelectedFleetFromMenuTicketPage$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(accountActions.setSelectedFleetFromMenu),
        withLatestFrom(this.vehiclesStore.select(getIsVehicleTicketPage)),
        // eslint-disable-next-line @typescript-eslint/no-shadow
        filter(([_, isVehicleTicketPage]: [FleetDto, boolean]) => isVehicleTicketPage),
        // eslint-disable-next-line @typescript-eslint/no-shadow
        map(([fleet, _]: [FleetDto, boolean]) => {
          this.router.navigate([`/${CorePaths.WORKSPACE}/${CorePaths.VEHICLES}`]).then(() => {
            this.store.dispatch(vehiclesActions.clearVehicleCreatePage());
            this.store.dispatch(accountActions.setSelectedFleet(fleet));
          });
        }),
      ),
    { dispatch: false },
  );

  constructor(
    private readonly actions$: Actions,
    private readonly vehiclesService: VehiclesService,
    private readonly ticketsService: TicketsService,
    private readonly vehiclesStore: Store<VehiclesState>,
    private readonly driversStore: Store<DriversState>,
    private readonly store: Store<AppState>,
    private readonly toastService: ToastService,
    private readonly router: Router,
    private readonly fleetRROService: FleetRROService,
    private readonly financeService: FinanceService,
    private readonly matDialog: MatDialog,
    @Inject(WINDOW) private readonly window: Window,
  ) {}
}
