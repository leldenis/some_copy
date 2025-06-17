import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { EntityType } from '@constant';
import {
  CourierDetailsDto,
  CourierProductCollectionDto,
  CourierRestrictionListDto,
  CourierRestrictionTypePayloadDto,
  EmployeeWalletItemDto,
  ProductConfigurationUpdateItemCollectionDto,
} from '@data-access';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { CorePaths } from '@ui/core/models/core-paths';
import { ToastService } from '@ui/core/services/toast.service';
import { AccountState } from '@ui/core/store/account/account.reducer';
import { selectedFleetId } from '@ui/core/store/account/account.selectors';
import { RemoveCourierDialogComponent } from '@ui/modules/couriers/features/courier-details/components/remove-courier-dialog/remove-courier-dialog.component';
import { REMOVE_COURIER_DIALOG_CONFIG } from '@ui/modules/couriers/features/courier-details/consts/dialog';
import { courierDetailsActions } from '@ui/modules/couriers/features/courier-details/store/courier-details.actions';
import { CourierDetailsState } from '@ui/modules/couriers/features/courier-details/store/courier-details.reducer';
import { getCourierId } from '@ui/modules/couriers/features/courier-details/store/courier-details.selectors';
import { CouriersService } from '@ui/modules/couriers/services/couriers.service';
import { FinanceService } from '@ui/modules/finance/services';
import { DEFAULT_CANNOT_REMOVE_ENTITY_DIALOG_CONFIG } from '@ui/shared/consts';
import { CannotRemoveEmployeeComponent, CannotRemoveEntityData } from '@ui/shared/dialogs/cannot-remove-employee';
import { catchError, defer, exhaustMap, filter, map, of, switchMap, take, tap } from 'rxjs';
import { withLatestFrom } from 'rxjs/operators';

@Injectable()
export class CourierDetailsEffects {
  public getFleetCourierById$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(courierDetailsActions.getFleetCourierById),
        switchMap((payload) =>
          this.couriersService.getFleetCourierById(payload.fleetId, payload.courierId).pipe(
            tap((courierDetails: CourierDetailsDto) => {
              this.courierDetailsStore.dispatch(courierDetailsActions.getFleetCourierByIdSuccess(courierDetails));
            }),
            catchError(() => {
              this.courierDetailsStore.dispatch(courierDetailsActions.getFleetCourierByIdFailed());
              return of(null);
            }),
          ),
        ),
      ),
    { dispatch: false },
  );

  public openRemoveCourierDialog$ = createEffect(
    () =>
      defer(() =>
        this.actions$.pipe(
          ofType(courierDetailsActions.openRemoveCourierDialog),
          withLatestFrom(this.accountStore.select(selectedFleetId), this.courierDetailsStore.select(getCourierId)),
          exhaustMap(([_, fleetId, courierId]: [Action, string, string]) =>
            this.financeService.getEmployeeWithWallet(fleetId, courierId),
          ),
          tap((courier: EmployeeWalletItemDto) => {
            if (courier.wallet?.balance.amount === 0) {
              const dialogRef = this.matDialog.open(RemoveCourierDialogComponent, {
                ...REMOVE_COURIER_DIALOG_CONFIG,
                data: {
                  placeholder: `${courier.last_name} ${courier.first_name}`,
                },
              });

              dialogRef
                .afterClosed()
                .pipe(
                  take(1),
                  filter((data) => data),
                )
                .subscribe(() => this.courierDetailsStore.dispatch(courierDetailsActions.removeFleetCourierById()));
            } else {
              const dialogRef = this.matDialog.open<CannotRemoveEmployeeComponent, CannotRemoveEntityData>(
                CannotRemoveEmployeeComponent,
                {
                  ...DEFAULT_CANNOT_REMOVE_ENTITY_DIALOG_CONFIG,
                  data: {
                    employee: { ...courier, type: EntityType.COURIER },
                  },
                },
              );

              dialogRef.afterClosed();
            }
          }),
        ),
      ),
    { dispatch: false },
  );

  public removeFleetCourierById$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(courierDetailsActions.removeFleetCourierById),
        withLatestFrom(this.accountStore.select(selectedFleetId), this.courierDetailsStore.select(getCourierId)),
        exhaustMap(([_, fleetId, courierId]: [Action, string, string]) =>
          this.couriersService.removeFleetCourierById(fleetId, courierId).pipe(
            tap(() => {
              this.courierDetailsStore.dispatch(courierDetailsActions.removeFleetCourierByIdSuccess());
              this.toastService.success('Notification.Courier.RemoveCourierSuccess');
            }),
            catchError(() => {
              this.courierDetailsStore.dispatch(courierDetailsActions.removeFleetCourierByIdFailed());
              this.toastService.error('Notification.Courier.RemoveCourierError');
              return of(null);
            }),
          ),
        ),
      ),
    { dispatch: false },
  );

  public removeFleetCourierByIdSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(courierDetailsActions.removeFleetCourierByIdSuccess),
        tap(async () => this.router.navigateByUrl(`${CorePaths.WORKSPACE}/${CorePaths.COURIERS}`)),
      ),
    { dispatch: false },
  );

  public getFleetCourierRestrictionSettings$ = createEffect(() =>
    this.actions$.pipe(
      ofType(courierDetailsActions.getFleetCourierRestrictionSettings),
      withLatestFrom(this.accountStore.select(selectedFleetId), this.courierDetailsStore.select(getCourierId)),
      switchMap(([_, fleetId, courierId]: [Action, string, string]) =>
        this.couriersService.getCourierRestrictionsSettings(fleetId, courierId).pipe(
          map((restrictionSettings: CourierRestrictionListDto) =>
            courierDetailsActions.getFleetCourierRestrictionSettingsSuccess(restrictionSettings),
          ),
          catchError(() => {
            courierDetailsActions.getFleetCourierRestrictionSettingsFailed();
            return of(null);
          }),
        ),
      ),
    ),
  );

  public updateFleetCourierRestrictionSettings$ = createEffect(() =>
    this.actions$.pipe(
      ofType(courierDetailsActions.updateFleetCourierRestriction),
      withLatestFrom(this.accountStore.select(selectedFleetId), this.courierDetailsStore.select(getCourierId)),
      exhaustMap(([{ restrictionType }, fleetId, courierId]: [CourierRestrictionTypePayloadDto, string, string]) =>
        this.couriersService.updateRestriction(fleetId, courierId, { type: restrictionType }).pipe(
          map(() => courierDetailsActions.updateFleetCourierRestrictionSuccess()),
          catchError(() => {
            courierDetailsActions.updateFleetCourierRestrictionFailed();
            return of(null);
          }),
        ),
      ),
    ),
  );

  public removeFleetCourierRestrictionSettings$ = createEffect(() =>
    this.actions$.pipe(
      ofType(courierDetailsActions.removeFleetCourierRestriction),
      withLatestFrom(this.accountStore.select(selectedFleetId), this.courierDetailsStore.select(getCourierId)),
      exhaustMap(([{ restrictionType }, fleetId, courierId]: [CourierRestrictionTypePayloadDto, string, string]) =>
        this.couriersService.removeRestriction(fleetId, courierId, { type: restrictionType }).pipe(
          map(() => courierDetailsActions.removeFleetCourierRestrictionSuccess()),
          catchError(() => {
            courierDetailsActions.removeFleetCourierRestrictionFailed();
            return of(null);
          }),
        ),
      ),
    ),
  );

  public getFleetCourierRestrictions$ = createEffect(() =>
    this.actions$.pipe(
      ofType(courierDetailsActions.getFleetCourierRestrictions),
      withLatestFrom(this.accountStore.select(selectedFleetId), this.courierDetailsStore.select(getCourierId)),
      switchMap(([_, fleetId, courierId]: [Action, string, string]) =>
        this.couriersService.getCourierRestrictions(fleetId, courierId).pipe(
          map((restrictions: CourierRestrictionListDto) =>
            courierDetailsActions.getFleetCourierRestrictionsSuccess(restrictions),
          ),
          catchError(() => {
            courierDetailsActions.getFleetCourierRestrictionsFailed();
            return of(null);
          }),
        ),
      ),
    ),
  );

  public triggerToUpdateRestrictions$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          courierDetailsActions.getFleetCourierByIdSuccess,
          courierDetailsActions.updateFleetCourierRestrictionSuccess,
          courierDetailsActions.removeFleetCourierRestrictionSuccess,
        ),
        tap(() => {
          this.courierDetailsStore.dispatch(courierDetailsActions.getFleetCourierRestrictions());
          this.courierDetailsStore.dispatch(courierDetailsActions.getFleetCourierRestrictionSettings());
        }),
      ),
    { dispatch: false },
  );

  public getFleetCourierProducts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(courierDetailsActions.getFleetCourierProducts),
      withLatestFrom(this.accountStore.select(selectedFleetId), this.courierDetailsStore.select(getCourierId)),
      switchMap(([_, fleetId, courierId]: [Action, string, string]) =>
        this.couriersService.getFleetCourierProducts(fleetId, courierId).pipe(
          map((products: CourierProductCollectionDto) =>
            courierDetailsActions.getFleetCourierProductsSuccess(products),
          ),
          catchError(() => {
            courierDetailsActions.getFleetCourierProductsFailed();
            return of(null);
          }),
        ),
      ),
    ),
  );

  public updateFleetCourierProducts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(courierDetailsActions.updateFleetCourierProducts),
      withLatestFrom(this.accountStore.select(selectedFleetId), this.courierDetailsStore.select(getCourierId)),
      exhaustMap(([payload, fleetId, courierId]: [ProductConfigurationUpdateItemCollectionDto, string, string]) =>
        this.couriersService.updateFleetCourierProducts(fleetId, courierId, payload).pipe(
          map(() => courierDetailsActions.updateFleetCourierProductsSuccess()),
          catchError(() => {
            courierDetailsActions.updateFleetCourierProductsFailed();
            return of(null);
          }),
        ),
      ),
    ),
  );

  public listenUpdateProducts$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(courierDetailsActions.updateFleetCourierProductsSuccess),
        tap(() => this.courierDetailsStore.dispatch(courierDetailsActions.getFleetCourierProducts())),
      ),
    { dispatch: false },
  );

  constructor(
    private readonly actions$: Actions,
    private readonly couriersService: CouriersService,
    private readonly financeService: FinanceService,
    private readonly accountStore: Store<AccountState>,
    private readonly courierDetailsStore: Store<CourierDetailsState>,
    private readonly toastService: ToastService,
    private readonly matDialog: MatDialog,
    private readonly router: Router,
  ) {}
}
