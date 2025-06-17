import { HttpStatusCode } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BlockedListStatusValue } from '@constant';
import { AccountDto, FleetDto } from '@data-access';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { RefinerIntegrationService } from '@ui/core';
import { CorePaths } from '@ui/core/models/core-paths';
import { AccountService } from '@ui/core/services/account.service';
import { DeviceService } from '@ui/core/services/device.service';
import { NotificationsService } from '@ui/core/services/notifications.service';
import {
  accountInfoKey,
  fleetIdKey,
  hiddenProfileIndicatorKey,
  StorageService,
  userIdKey,
  userRoleKey,
} from '@ui/core/services/storage.service';
import { ToastService } from '@ui/core/services/toast.service';
import { accountActions } from '@ui/core/store/account/account.actions';
import { AccountState } from '@ui/core/store/account/account.reducer';
import { getIsAccountPage } from '@ui/core/store/account/account.selectors';
import { authActions } from '@ui/core/store/auth/auth.actions';
import { AuthState } from '@ui/core/store/auth/auth.reducer';
import { referencesActions } from '@ui/core/store/references/references.actions';
import { getRROEnabled } from '@ui/core/store/root/root.selectors';
import { ProfileIndicatorService } from '@ui/modules/fleet-profile/features/fleet-rro/services';
import { exhaustMap, Observable, of } from 'rxjs';
import { catchError, filter, map, switchMap, tap, withLatestFrom } from 'rxjs/operators';

@Injectable()
export class AccountEffects {
  public getAccountInfo$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(accountActions.getAccountInfo),
        switchMap(() => {
          return this.accountService.getMe().pipe(
            switchMap((account) => {
              // TODO: Enable login for private fleets on webview. Removed after webview decoupling
              const shouldLogout = account.fleets.length === 0 && !this.deviceService.getEmbeddedPlatform();
              return shouldLogout ? this.handleLogout(HttpStatusCode.NotFound) : of(account);
            }),
            filter(Boolean),
            // eslint-disable-next-line complexity
            tap((accountInfo: AccountDto) => {
              this.storageService.set(accountInfoKey, accountInfo);
              this.storageService.set(userIdKey, accountInfo.user_id);
              this.store.dispatch(accountActions.getAccountInfoSuccess(accountInfo));
              const selectedFleetId = this.storageService.get(fleetIdKey);
              let selectedFleet: FleetDto;

              if (selectedFleetId) {
                selectedFleet = accountInfo.fleets.find((fleet: FleetDto) => fleet.id === selectedFleetId);
                if (selectedFleet) {
                  this.storageService.set(userRoleKey, selectedFleet.role);
                  this.store.dispatch(accountActions.setSelectedFleet(selectedFleet));
                }
              } else {
                selectedFleet = accountInfo?.fleets[0];
                this.store.dispatch(accountActions.setSelectedFleet(selectedFleet));
                this.storageService.set(userRoleKey, selectedFleet?.role);
              }
            }),
            catchError(({ status }) => this.handleLogout(status)),
          );
        }),
      );
    },
    { dispatch: false },
  );

  public getAccountInfoSuccess$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(accountActions.getAccountInfoSuccess),
        tap((accountInfo) => {
          if (accountInfo?.status?.value === BlockedListStatusValue.BLOCKED) {
            this.router.navigate([`/${CorePaths.WORKSPACE}/${CorePaths.FLEET_FORBIDDEN}`]);
          }
        }),
        switchMap(() => [referencesActions.getAllDictionaries()]),
      );
    },
    { dispatch: true },
  );

  public setSelectedFleet$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(accountActions.setSelectedFleet),
        withLatestFrom(this.store.select(getRROEnabled)),
        tap(([selectedFleet, rroEnabled]: [FleetDto, boolean]) => {
          this.storageService.set('selectedFleetId', selectedFleet.id);
          this.profileIndicatorService.show(selectedFleet.id);

          this.initializeRefinerUser(selectedFleet);

          if (!rroEnabled) {
            this.storageService.delete(hiddenProfileIndicatorKey);
          }
        }),
        exhaustMap(([{ id }]) => this.notificationsService.getFleetUnreadNotificationsCount(id)),
      );
    },
    { dispatch: false },
  );

  public getAccountInfoSuccessFromMenu$ = createEffect(
    () => {
      return this.actions$.pipe(ofType(accountActions.setSelectedFleetFromMenu));
    },
    { dispatch: false },
  );

  public setSelectedFleetFromMenu$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(accountActions.setSelectedFleetFromMenu),
        withLatestFrom(this.store.select(getIsAccountPage)),
        filter(([_, isAccountPage]: [FleetDto, boolean]) => isAccountPage),
        map(([fleet, _]: [FleetDto, boolean]) => {
          this.router.navigate([`/${CorePaths.WORKSPACE}/${CorePaths.GENERAL}`]).then(() => {
            this.store.dispatch(accountActions.setSelectedFleet(fleet));
          });
        }),
      );
    },
    { dispatch: false },
  );

  public sendVerificationCode$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(accountActions.sendVerificationCode),
        switchMap(() => {
          return this.accountService.sendVerificationCode().pipe(
            tap(() => {
              this.store.dispatch(accountActions.sendVerificationCodeSuccess());
            }),
            catchError(() => {
              this.store.dispatch(accountActions.sendVerificationCodeFailed());
              return of(null);
            }),
          );
        }),
      );
    },
    { dispatch: false },
  );

  public verificationCodeSent$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(accountActions.sendVerificationCodeSuccess, accountActions.sendVerificationCodeFailed),
      );
    },
    { dispatch: false },
  );

  constructor(
    private readonly actions$: Actions,
    private readonly accountService: AccountService,
    private readonly store: Store<AccountState | AuthState>,
    private readonly router: Router,
    private readonly storageService: StorageService,
    private readonly toastService: ToastService,
    private readonly notificationsService: NotificationsService,
    private readonly profileIndicatorService: ProfileIndicatorService,
    private readonly deviceService: DeviceService,
    private readonly refinerService: RefinerIntegrationService,
  ) {}

  private handleLogout(statusCode: HttpStatusCode): Observable<null> {
    this.store.dispatch(accountActions.getAccountInfoFailed());
    this.store.dispatch(authActions.logout());
    this.notificationsService.closeNotificationsSidenav();

    if (statusCode === HttpStatusCode.NotFound) {
      // Returns 404 if user was removed from fleet
      this.router.navigateByUrl('auth/forbidden');
    } else {
      this.router.navigateByUrl('auth/login');
      this.toastService.warn('Auth.Login.LoggedOutError');
    }

    return of(null);
  }

  private initializeRefinerUser({ region_id, name, id, role }: FleetDto): void {
    const account = this.storageService.get<AccountDto>(accountInfoKey);

    const identity = {
      id: account?.user_id ?? '',
      email: account?.email ?? '',
      name: `${account?.last_name} ${account?.first_name}`,
      phone_number: account?.phone ?? '',
      role: role ?? '',
      city_id: region_id ?? 0,
      fleet_name: name ?? '',
      fleet_id: id ?? '',
    };

    this.refinerService.identify(identity);
    this.refinerService.addToResponse(identity);
  }
}
