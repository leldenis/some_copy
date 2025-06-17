import { AsyncPipe, NgTemplateOutlet } from '@angular/common';
import { HttpStatusCode } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, Renderer2 } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatAnchor, MatButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatError, MatFormField, MatLabel, MatSuffix } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
  AnalyticsBase,
  AnalyticsLoginError,
  AnalyticsLoginPhone,
  AuthMethod,
  FleetAnalyticsEventType,
} from '@data-access';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { AnalyticsService } from '@ui/core/services/analytics.service';
import { AuthService } from '@ui/core/services/auth.service';
import { StorageService } from '@ui/core/services/storage.service';
import { authActions } from '@ui/core/store/auth/auth.actions';
import { AuthEffects } from '@ui/core/store/auth/auth.effects';
import { AuthState } from '@ui/core/store/auth/auth.reducer';
import { getSignInLoading } from '@ui/core/store/auth/auth.selectors';
import { LoginOtcComponent } from '@ui/modules/auth/components';
import { ForgotPasswordDialogComponent } from '@ui/modules/auth/components/forgot-password-dialog/forgot-password-dialog.component';
import { LoginFormGroupDto } from '@ui/modules/auth/models/auth-form.dto';
import { LoaderButtonComponent } from '@ui/shared/components/loader-button/loader-button.component';
import { LetDirective } from '@ui/shared/directives/let.directive';
import { switchMap, throwError } from 'rxjs';
import { catchError, filter, tap } from 'rxjs/operators';

@Component({
  selector: 'upf-login-password',
  standalone: true,
  imports: [
    TranslateModule,
    ReactiveFormsModule,
    MatError,
    MatFormField,
    MatIcon,
    MatInput,
    MatLabel,
    MatSuffix,
    LetDirective,
    LoaderButtonComponent,
    LoginOtcComponent,
    AsyncPipe,
    MatButton,
    RouterLink,
    MatAnchor,
    NgTemplateOutlet,
  ],
  templateUrl: './login-password.component.html',
  styleUrl: './login-password.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginPasswordComponent implements OnInit {
  public readonly authMethod = AuthMethod;
  public readonly loginForm = new FormGroup<LoginFormGroupDto>({
    contact: new FormControl<string>(null, Validators.required),
    password: new FormControl<string>(null, [Validators.required, Validators.minLength(4), Validators.maxLength(36)]),
    isRememberMe: new FormControl<boolean>(true),
  });
  public readonly loadingLogin$ = this.store.select(getSignInLoading);
  public readonly params$ = this.route.queryParams.pipe(
    filter(Boolean),
    tap((params) => this.loginForm.patchValue(params)),
  );

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly analytics: AnalyticsService,
    private readonly store: Store<AuthState>,
    private readonly authEffects: AuthEffects,
    private readonly dialog: MatDialog,
    private readonly authService: AuthService,
    private readonly destroyRef: DestroyRef,
    private readonly storage: StorageService,
    private readonly renderer: Renderer2,
  ) {}

  private get codePayload(): { device_id: string; user_contact: string } {
    return {
      device_id: this.storage.getOrCreateDeviceId(),
      user_contact: this.loginForm.value.contact,
    };
  }

  public ngOnInit(): void {
    this.authEffects.loginFailed$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((err) => this.errorHandler(err));
    this.authEffects.loginSuccess$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => this.reportLoginSuccess());
  }

  public togglePasswordFieldVisibility(input: HTMLInputElement): void {
    const newType = input.type === 'password' ? 'text' : 'password';
    this.renderer.setAttribute(input, 'type', newType);
  }

  public handlePrivacyPolicyClick(event: Event): void {
    if (event.target instanceof HTMLAnchorElement) {
      this.analytics.reportEvent<AnalyticsBase>(FleetAnalyticsEventType.LOGIN_PRIVACY_POLICY_LINK);
    }
  }

  public onResetPassword(): void {
    this.analytics.reportEvent<AnalyticsBase>(FleetAnalyticsEventType.FORGOT_PASSWORD);

    this.dialog
      .open(ForgotPasswordDialogComponent, {
        panelClass: 'mat-dialog-no-padding',
      })
      .afterClosed()
      .pipe(
        filter(Boolean),
        switchMap(() => this.authService.resetPassword(this.codePayload)),
      )
      .subscribe(() => {
        const { contact, isRememberMe } = this.loginForm.value;
        this.router.navigate([], { queryParams: { contact, isRememberMe, method: AuthMethod.SMS, reset: true } });
      });
  }

  public onResendCode(isReset: boolean): void {
    const request$ = isReset
      ? this.authService.resetPassword(this.codePayload)
      : this.authService.sendOTC(this.codePayload).pipe(
          catchError((error) => {
            if (error.status === HttpStatusCode.Forbidden) {
              this.loginForm.setErrors({ throttlingError: true });
              this.loginForm.get('password').setErrors({ invalid: true });
            }
            return throwError(() => error);
          }),
        );

    request$.pipe(catchError((error) => throwError(() => error))).subscribe();
  }

  public login(loading: boolean): void {
    if (loading || this.loginForm.invalid) return;

    const { contact, password, isRememberMe } = this.loginForm.value;
    this.store.dispatch(authActions.login({ contact, password, isRememberMe }));
  }

  private errorHandler({ status, message }: { status: number; message?: string }): void {
    this.loginForm.patchValue({ password: null });
    this.loginForm.setErrors(
      status === HttpStatusCode.BadRequest ? { invalidCredentials: true } : { unhandledError: true },
    );
    this.loginForm.get('password').setErrors({ invalid: true });

    this.analytics.reportEvent<AnalyticsLoginError>(FleetAnalyticsEventType.LOGIN_PHONE_INPUT_INCORRECT, {
      phone: this.loginForm.value.contact,
      error_code: status,
      error_text: message,
    });
  }

  private reportLoginSuccess(): void {
    this.analytics.reportEvent<AnalyticsBase>(FleetAnalyticsEventType.LOGIN_PASSWORD_INPUT_CORRECT);
    this.analytics.reportEvent<AnalyticsLoginPhone>(FleetAnalyticsEventType.LOGIN_PHONE_INPUT_CORRECT, {
      phone: this.loginForm.value.contact,
    });
  }
}
