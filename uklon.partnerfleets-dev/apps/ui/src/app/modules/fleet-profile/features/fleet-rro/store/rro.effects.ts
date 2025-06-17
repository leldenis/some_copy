import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { LoadingIndicatorService } from '@ui/core/services/loading-indicator.service';
import { ToastService } from '@ui/core/services/toast.service';
import { selectedFleetId } from '@ui/core/store/account/account.selectors';
import { AppState } from '@ui/core/store/app.state';
import { FiscalizationSettingsModalComponent } from '@ui/modules/fleet-profile/features/fleet-rro/components/fiscalization-settings-modal/fiscalization-settings-modal.component';
import { HowToGetKeyModalComponent } from '@ui/modules/fleet-profile/features/fleet-rro/components/how-to-get-key-modal/how-to-get-key-modal.component';
import { KeyInfoModalComponent } from '@ui/modules/fleet-profile/features/fleet-rro/components/key-info-modal/key-info-modal.component';
import { LinkCashToKeyModalComponent } from '@ui/modules/fleet-profile/features/fleet-rro/components/link-cash-to-key-modal/link-cash-to-key-modal.component';
import { LinkCashToVehicleComponent } from '@ui/modules/fleet-profile/features/fleet-rro/components/link-cash-to-vehicle/link-cash-to-vehicle.component';
import { UnlinkCashFromVehicleComponent } from '@ui/modules/fleet-profile/features/fleet-rro/components/unlink-cash-from-vehicle/unlink-cash-from-vehicle.component';
import { UploadKeyModalComponent } from '@ui/modules/fleet-profile/features/fleet-rro/components/upload-key-modal/upload-key-modal.component';
import {
  ACTIVATE_FISCALIZATION_MODAL_DATA,
  ACTIVATE_FISCALIZATION_NOTIFICATIONS,
  DEACTIVATE_FISCALIZATION_NOTIFICATIONS,
  FISCALIZATION_DEACTIVATE_MODAL_DATA,
  REMOVE_SIGNATURE_KEY_MODAL_DATA,
  UNAVAILABLE_FISCALIZATION_MODAL_DATA,
} from '@ui/modules/fleet-profile/features/fleet-rro/models';
import { FleetRROService } from '@ui/modules/fleet-profile/features/fleet-rro/services';
import { fleetRROActions } from '@ui/modules/fleet-profile/features/fleet-rro/store/rro.actions';
import {
  fiscalizationSettings,
  fiscalizationStatus,
} from '@ui/modules/fleet-profile/features/fleet-rro/store/rro.selectors';
import { DEFAULT_LIMIT } from '@ui/shared/consts';
import { ConfirmationComponent } from '@ui/shared/dialogs/confirmation/confirmation.component';
import { SimpleModalComponent } from '@ui/shared/dialogs/simple-modal/simple-modal.component';
import { exhaustMap, of } from 'rxjs';
import { catchError, concatMap, filter, map, switchMap, take, tap, withLatestFrom } from 'rxjs/operators';

@Injectable()
export class FleetRROEffects {
  public readonly getFleetFiscalizationSettings$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fleetRROActions.getFiscalizationSettings),
      withLatestFrom(this.store.select(selectedFleetId)),
      switchMap(([_, fleetId]) => {
        return this.fleetRROService.getFleetFiscalizationSetting(fleetId).pipe(
          map((settings) => fleetRROActions.getFiscalizationSettingsSuccess({ settings })),
          catchError(() => of(fleetRROActions.getFiscalizationSettingsFailed())),
        );
      }),
    ),
  );

  public readonly updateFleetFiscalizationSettings$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fleetRROActions.updateFiscalizationSettings),
      withLatestFrom(this.store.select(selectedFleetId)),
      exhaustMap(([{ settings }, fleetId]) => {
        return this.fleetRROService.updateFleetFiscalizationSettings(fleetId, settings).pipe(
          map(() => fleetRROActions.updateFiscalizationSettingsSuccess()),
          catchError(() => of(fleetRROActions.updateFiscalizationSettingsFailed())),
        );
      }),
    ),
  );

  public readonly updateFleetFiscalizationSettingsSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fleetRROActions.updateFiscalizationSettingsSuccess),
      tap(() => this.toastService.success('FleetProfile.RRO.Modals.Settings.Notification.Success')),
      map(() => fleetRROActions.getFiscalizationSettings()),
    ),
  );

  public readonly updateFleetFiscalizationSettingsError$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(fleetRROActions.updateFiscalizationSettingsFailed),
        tap(() => this.toastService.success('FleetProfile.RRO.Modals.Settings.Notification.Error')),
      ),
    { dispatch: false },
  );

  public openFiscalizationSettingsDialog$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(fleetRROActions.openFiscalizationSettingsDialog),
        withLatestFrom(this.store.select(fiscalizationSettings)),
        tap(([_, settings]) => {
          this.matDialog
            .open(FiscalizationSettingsModalComponent, {
              panelClass: 'mat-dialog-no-padding',
              disableClose: false,
              data: { ...settings },
            })
            .afterClosed()
            .pipe(take(1), filter(Boolean))
            .subscribe(({ settings: newSettings }) =>
              this.store.dispatch(fleetRROActions.updateFiscalizationSettings({ settings: newSettings })),
            );
        }),
      ),
    { dispatch: false },
  );

  public readonly getFleetFiscalizationStatus$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fleetRROActions.getFiscalizationStatus),
      withLatestFrom(this.store.select(selectedFleetId)),
      switchMap(([_, fleetId]) => {
        return this.fleetRROService.getFleetFiscalizationStatus(fleetId).pipe(
          map(({ status }) => fleetRROActions.getFiscalizationStatusSuccess({ status })),
          catchError(() => of(fleetRROActions.getFiscalizationStatusFailed())),
        );
      }),
    ),
  );

  public readonly updateFleetFiscalizationStatus$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fleetRROActions.updateFiscalizationStatus),
      withLatestFrom(this.store.select(selectedFleetId)),
      exhaustMap(([data, fleetId]) => {
        return this.fleetRROService.updateFleetFiscalizationStatus(fleetId, { status: data.status }).pipe(
          map(() => fleetRROActions.updateFiscalizationStatusSuccess(data)),
          catchError(() => {
            this.store.dispatch(fleetRROActions.updateFiscalizationStatusSuccess(data));
            return of(fleetRROActions.updateFiscalizationStatusFailed());
          }),
        );
      }),
    ),
  );

  public readonly updateFiscalizationStatusSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fleetRROActions.updateFiscalizationStatusSuccess),
      concatMap((data) => [
        fleetRROActions.getFiscalizationStatus(),
        fleetRROActions.showUpdateFiscalizationStatusNotification(data),
      ]),
    ),
  );

  public readonly showUpdateFiscalizationStatusNotification$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(fleetRROActions.showUpdateFiscalizationStatusNotification),
        tap(({ status, success, error }) => {
          status ? this.toastService.success(success) : this.toastService.error(error);
        }),
      ),
    { dispatch: false },
  );

  public readonly toggleActivateFiscalization$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(fleetRROActions.toggleActivateFiscalization),
        withLatestFrom(this.store.select(fiscalizationStatus), this.store.select(fiscalizationSettings)),
        tap(([_, status, settings]) => {
          if (!settings) {
            this.store.dispatch(
              fleetRROActions.openActivateFiscalizationModal({
                data: UNAVAILABLE_FISCALIZATION_MODAL_DATA,
              }),
            );
          } else if (status) {
            const action = fleetRROActions.updateFiscalizationStatus({
              status: false,
              ...DEACTIVATE_FISCALIZATION_NOTIFICATIONS,
            });
            this.store.dispatch(
              fleetRROActions.openActivateFiscalizationModal({
                data: FISCALIZATION_DEACTIVATE_MODAL_DATA,
                callbackAction: action,
              }),
            );
          } else {
            const action = fleetRROActions.updateFiscalizationStatus({
              status: true,
              ...ACTIVATE_FISCALIZATION_NOTIFICATIONS,
            });
            this.store.dispatch(
              fleetRROActions.openActivateFiscalizationModal({
                data: ACTIVATE_FISCALIZATION_MODAL_DATA,
                callbackAction: action,
              }),
            );
          }
        }),
      ),
    { dispatch: false },
  );

  public openActivateFiscalizationModal$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(fleetRROActions.openActivateFiscalizationModal),
        tap(({ data, callbackAction }) => {
          this.matDialog
            .open(SimpleModalComponent, {
              panelClass: 'mat-dialog-no-padding',
              disableClose: false,
              data,
            })
            .afterClosed()
            .pipe(take(1), filter(Boolean))
            .subscribe(() => this.store.dispatch(callbackAction));
        }),
      ),
    { dispatch: false },
  );

  public openUploadSignatureKeyModal$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(fleetRROActions.openUploadSignatureKeyModal),
        withLatestFrom(this.store.select(selectedFleetId)),
        tap(([_, fleetId]) => {
          this.matDialog
            .open(UploadKeyModalComponent, {
              panelClass: 'mat-dialog-no-padding',
              disableClose: true,
              data: {
                fleetId,
              },
            })
            .afterClosed()
            .pipe(take(1))
            .subscribe((data) => {
              this.store.dispatch(fleetRROActions.closeUploadSignatureKeyModal());
              if (data) {
                this.store.dispatch(fleetRROActions.uploadSignatureKeySuccess());
              }
            });
        }),
      ),
    { dispatch: false },
  );

  public readonly uploadSignatureKeySuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fleetRROActions.uploadSignatureKeySuccess),
      tap(() => this.toastService.success('FleetProfile.RRO.Modals.UploadKey.Notification.Success')),
      map(() => fleetRROActions.getSignatureKeys()),
    ),
  );

  public openConfirmationModal$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(fleetRROActions.openConfirmationModal),
        tap(() => {
          this.matDialog
            .open(ConfirmationComponent, {
              panelClass: 'confirmation-modal',
              disableClose: false,
              data: {
                title: 'FleetProfile.RRO.Modals.Confirmation.Title',
                content: 'FleetProfile.RRO.Modals.Confirmation.Content',
                declineBtn: 'Common.Buttons.B_Reject',
                acceptBtn: 'Common.Buttons.B_Close',
              },
            })
            .afterClosed()
            .pipe(take(1))
            .subscribe((shouldCloseAll: boolean) => {
              if (shouldCloseAll) {
                this.matDialog.closeAll();
              }
            });
        }),
      ),
    { dispatch: false },
  );

  public openHowToGetKeyModal$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(fleetRROActions.openHowToGetKeyModal),
        tap(() => {
          this.matDialog
            .open(HowToGetKeyModalComponent, {
              minHeight: '470px',
              panelClass: 'mat-dialog-no-padding',
              disableClose: false,
            })
            .afterClosed()
            .pipe(take(1))
            .subscribe();
        }),
      ),
    { dispatch: false },
  );

  public readonly getFleetSignatureKeys$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fleetRROActions.getSignatureKeys),
      withLatestFrom(this.store.select(selectedFleetId)),
      tap(() => this.loaderService.show()),
      switchMap(([_, fleetId]) => {
        return this.fleetRROService.getFleetSignatureKeys(fleetId).pipe(
          map((keys) => {
            this.loaderService.hide();
            return fleetRROActions.getSignatureKeysSuccess({ keys });
          }),
          catchError(() => {
            this.loaderService.hide();
            return of(fleetRROActions.getSignatureKeysFailed());
          }),
        );
      }),
    ),
  );

  public readonly removeSignatureKey$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fleetRROActions.removeSignatureKey),
      exhaustMap(({ keyId }) => {
        return this.fleetRROService.removeSignatureKeyById(keyId).pipe(
          map(() => {
            this.toastService.success('FleetProfile.RRO.Modals.RemoveKey.Notification.Success');
            return fleetRROActions.removeSignatureKeySuccess();
          }),
          catchError(() => of(fleetRROActions.removeSignatureKeyFailed())),
        );
      }),
    ),
  );

  public readonly removeSignatureKeySuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fleetRROActions.removeSignatureKeySuccess),
      map(() => fleetRROActions.getSignatureKeys()),
    ),
  );

  public openRemoveKeyModal$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(fleetRROActions.openRemoveKeyModal),
        tap(({ keyId, display_name }) => {
          this.matDialog
            .open(SimpleModalComponent, {
              panelClass: 'mat-dialog-no-padding',
              disableClose: false,
              data: {
                ...REMOVE_SIGNATURE_KEY_MODAL_DATA,
                content: this.translateService.instant('FleetProfile.RRO.Modals.RemoveKey.Content', {
                  name: display_name,
                }),
              },
            })
            .afterClosed()
            .pipe(take(1), filter(Boolean))
            .subscribe(() => this.store.dispatch(fleetRROActions.removeSignatureKey({ keyId })));
        }),
      ),
    { dispatch: false },
  );

  public openKeyInfoModal$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(fleetRROActions.openKeyInfoModal),
        tap(({ key }) => {
          this.matDialog
            .open(KeyInfoModalComponent, {
              panelClass: 'mat-dialog-no-padding',
              disableClose: false,
              data: { ...key },
            })
            .afterClosed()
            .pipe(take(1))
            .subscribe();
        }),
      ),
    { dispatch: false },
  );

  public readonly getCashierPositions$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fleetRROActions.getCashierPositions),
      withLatestFrom(this.store.select(selectedFleetId)),
      switchMap(([{ cashierId }, fleetId]) => {
        return this.fleetRROService.getFleetCashiersPos(fleetId, cashierId).pipe(
          map((cashiers) => fleetRROActions.getCashierPositionsSuccess({ cashiers })),
          catchError(() => of(fleetRROActions.getCashierPositionsFailed())),
        );
      }),
    ),
  );

  public openLinkCashToKeyModal$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(fleetRROActions.openLinkCashToKeyModal),
        tap(({ cashierId }) => {
          this.store.dispatch(fleetRROActions.getCashierPositions({ cashierId }));
          this.matDialog
            .open(LinkCashToKeyModalComponent, {
              panelClass: 'mat-dialog-no-padding',
              disableClose: false,
              data: { cashierId },
            })
            .afterClosed()
            .pipe(take(1))
            .subscribe((data) => {
              if (data) {
                this.toastService.success('FleetProfile.RRO.Modals.LinkCashToKey.Notification.Success');
                this.store.dispatch(fleetRROActions.getSignatureKeys());
              }

              this.store.dispatch(fleetRROActions.closeLinkCashToKeyModal());
            });
        }),
      ),
    { dispatch: false },
  );

  public openLinkCashToVehicleModal$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(fleetRROActions.openLinkCashToVehicleModal),
        tap(({ cashierId, vehicle }) => {
          this.matDialog
            .open(LinkCashToVehicleComponent, {
              panelClass: 'mat-dialog-no-padding',
              disableClose: false,
              data: { cashierId, vehicle },
            })
            .afterClosed()
            .pipe(take(1))
            .subscribe((data) => {
              if (data) {
                this.store.dispatch(fleetRROActions.getFleetVehicles({ query: { limit: DEFAULT_LIMIT, offset: 0 } }));
                this.toastService.success('FleetProfile.RRO.Modals.LinkCashToVehicle.Notification.Success');
              }
            });
        }),
      ),
    { dispatch: false },
  );

  public openUnLinkCashFromVehicleModal$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(fleetRROActions.openUnLinkCashFromVehicleModal),
        tap((payload) => {
          this.matDialog
            .open(UnlinkCashFromVehicleComponent, {
              panelClass: 'mat-dialog-no-padding',
              disableClose: false,
              data: {
                ...payload,
              },
            })
            .afterClosed()
            .pipe(take(1))
            .subscribe((data) => {
              if (data) {
                this.store.dispatch(fleetRROActions.getFleetVehicles({ query: { limit: DEFAULT_LIMIT, offset: 0 } }));
                this.toastService.success('FleetProfile.RRO.Modals.UnLinkCashFromVehicle.Notification.Success');
              }
            });
        }),
      ),
    { dispatch: false },
  );

  public readonly getFleetVehicles$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fleetRROActions.getFleetVehicles),
      withLatestFrom(this.store.select(selectedFleetId)),
      tap(() => this.loaderService.show()),
      switchMap(([{ query }, fleetId]) => {
        return this.fleetRROService.getFleetVehiclesFiscalization(fleetId, query).pipe(
          map((vehicles) => {
            this.loaderService.hide();
            return fleetRROActions.getFleetVehiclesSuccess({ vehicles });
          }),
          catchError(() => {
            this.loaderService.hide();
            return of(fleetRROActions.getFleetVehiclesFailed());
          }),
        );
      }),
    ),
  );

  constructor(
    private readonly actions$: Actions,
    private readonly store: Store<AppState>,
    private readonly fleetRROService: FleetRROService,
    private readonly matDialog: MatDialog,
    private readonly toastService: ToastService,
    private readonly translateService: TranslateService,
    private readonly loaderService: LoadingIndicatorService,
  ) {}
}
