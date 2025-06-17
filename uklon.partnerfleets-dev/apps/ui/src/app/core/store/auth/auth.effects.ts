import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { GrantType } from '@constant';
import { IdentityDto, AuthenticationDto } from '@data-access';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { UserDto } from '@ui/core/models/user.dto';
import { AuthService } from '@ui/core/services/auth.service';
import {
  StorageService,
  storageUserKey,
  StorageType,
  localeIdKey,
  KEEP_STORAGE_KEYS,
} from '@ui/core/services/storage.service';
import { WebsocketService } from '@ui/core/services/websocket.service';
import { accountActions } from '@ui/core/store/account/account.actions';
import { AccountState } from '@ui/core/store/account/account.reducer';
import { authActions } from '@ui/core/store/auth/auth.actions';
import { AuthState } from '@ui/core/store/auth/auth.reducer';
import { AuthFormDto } from '@ui/modules/auth/models/auth-form.dto';
import { environment } from '@ui-env/environment';
import { ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';
import { switchMap, tap, catchError } from 'rxjs/operators';

@Injectable()
export class AuthEffects {
  public login$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(authActions.login),
        switchMap((payload: AuthFormDto) => {
          this.storageService.setStorageType(payload.isRememberMe ? StorageType.LOCAL : StorageType.SESSION);
          const authenticationPayload: AuthenticationDto = {
            contact: payload.contact.toString(),
            password: payload.password,
            grant_type: GrantType.PASSWORD,
            client_id: environment.clientId,
            client_secret: environment.clientSecret,
            device_id: this.storageService.getOrCreateDeviceId(),
          };
          return this.authService.login(authenticationPayload).pipe(
            tap((identity: IdentityDto) => this.authStore.dispatch(authActions.loginSuccess(identity))),
            catchError((err) => {
              this.authStore.dispatch(
                authActions.loginFailed({
                  status: err?.status,
                  subCode: err?.error?.sub_code,
                  message: err?.error?.message,
                }),
              );

              return of(null);
            }),
          );
        }),
      );
    },
    { dispatch: false },
  );

  public loginSuccess$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(authActions.loginSuccess),
        tap((identity: IdentityDto) => {
          const user: UserDto = {
            accessToken: identity.access_token,
            refreshToken: identity.refresh_token,
            deviceId: this.storageService.getOrCreateDeviceId(),
          };
          this.storageService.set(storageUserKey, user);
          this.authStore.dispatch(authActions.setUser(user));
          this.accountStore.dispatch(accountActions.getAccountInfo());
        }),
      );
    },
    { dispatch: false },
  );

  public refreshToken$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(authActions.refreshToken),
        tap((identity: IdentityDto) => {
          const user: UserDto = {
            accessToken: identity.access_token,
            refreshToken: identity.refresh_token,
            deviceId: this.storageService.getOrCreateDeviceId(),
          };
          this.storageService.set(storageUserKey, user);
          this.authStore.dispatch(authActions.setUser(user));
          this.accountStore.dispatch(accountActions.getAccountInfo());
        }),
      );
    },
    { dispatch: false },
  );

  public loginFailed$ = createEffect(
    () => {
      return this.actions$.pipe(ofType(authActions.loginFailed));
    },
    { dispatch: false },
  );

  public logout$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(authActions.logout),
        tap(() => {
          const localeId = this.storageService.get(localeIdKey);
          this.matDialog.closeAll();
          this.toastrService.clear();
          this.storageService.clearExcept(KEEP_STORAGE_KEYS);
          this.router.navigateByUrl('/auth');
          this.storageService.set(localeIdKey, localeId);
          this.websocketService.disconnect();
        }),
      );
    },
    { dispatch: false },
  );

  public getUser$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(authActions.getUser),
        tap(() => {
          const user: UserDto = this.storageService.get(storageUserKey);
          if (user) {
            this.authStore.dispatch(authActions.setUser(user));
            this.accountStore.dispatch(accountActions.getAccountInfo());
          }
        }),
      );
    },
    { dispatch: false },
  );

  public setUser$ = createEffect(
    () => {
      return this.actions$.pipe(ofType(authActions.setUser));
    },
    { dispatch: false },
  );

  constructor(
    private readonly actions$: Actions,
    private readonly authService: AuthService,
    private readonly authStore: Store<AuthState>,
    private readonly accountStore: Store<AccountState>,
    private readonly router: Router,
    private readonly storageService: StorageService,
    private readonly matDialog: MatDialog,
    private readonly websocketService: WebsocketService,
    private readonly toastrService: ToastrService,
  ) {}
}
