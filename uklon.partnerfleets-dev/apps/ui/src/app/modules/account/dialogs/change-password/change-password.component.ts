import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import {
  AnalyticsError,
  AnalyticsUserRole,
  AuthMethod,
  CustomAnalyticsPropertiesDto,
  FleetAnalyticsEventType,
} from '@data-access';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AccountService } from '@ui/core/services/account.service';
import { AnalyticsService } from '@ui/core/services/analytics.service';
import { StorageService, userRoleKey } from '@ui/core/services/storage.service';
import { ToastService } from '@ui/core/services/toast.service';
import { ResetPasswordComponent } from '@ui/modules/auth/components';
import { PasswordValidityEventDto } from '@ui/modules/auth/models/password-validity-event.dto';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'upf-change-password',
  standalone: true,
  imports: [TranslateModule, MatIcon, MatIconButton, ResetPasswordComponent, MatButton],
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChangePasswordComponent {
  public readonly authMethod = AuthMethod;

  private readonly userRole = this.storage.get(userRoleKey) || '';

  constructor(
    public readonly dialogRef: MatDialogRef<ChangePasswordComponent>,
    private readonly accountService: AccountService,
    private readonly storage: StorageService,
    private readonly toastService: ToastService,
    private readonly translateService: TranslateService,
    private readonly analytics: AnalyticsService,
    @Inject(MAT_DIALOG_DATA) public readonly userAuthMethod: AuthMethod,
  ) {}

  public onCloseDialog(): void {
    this.dialogRef.close();
    this.reportEvent(FleetAnalyticsEventType.PROFILE_CHANGE_PASSWORD_POPUP_CLOSED, {
      auth_method: this.userAuthMethod,
    });
  }

  public onChangePassword(password: string): void {
    this.reportEvent(FleetAnalyticsEventType.PROFILE_CHANGE_PASSWORD_POPUP_SUBMIT, {
      auth_method: this.userAuthMethod,
    });

    this.accountService
      .changePassword(password)
      .pipe(catchError((error) => this.handleError(error)))
      .subscribe(() => {
        this.dialogRef.close(true);
        this.reportEvent(FleetAnalyticsEventType.PROFILE_CHANGE_PASSWORD_POPUP_SUCCESS);

        const notificationKey = this.userAuthMethod === AuthMethod.SMS ? 'SuccessCreate' : 'Success';
        this.toastService.success(this.translateService.instant(`Auth.ResetPassword.Notifications.${notificationKey}`));
      });
  }

  public onChangePasswordFormControlValidityChange({ control, valid }: PasswordValidityEventDto): void {
    if (control === 'newPassword' && valid) {
      this.reportEvent(FleetAnalyticsEventType.PROFILE_CHANGE_PASSWORD_POPUP_NEW_PASSWORD_VALID);
      return;
    }

    if (control === 'confirmPassword') {
      const eventType = valid
        ? FleetAnalyticsEventType.PROFILE_CHANGE_PASSWORD_POPUP_CONFIRM_PASSWORD_VALID
        : FleetAnalyticsEventType.PROFILE_CHANGE_PASSWORD_POPUP_PASSWORD_MISSMATCH;

      this.reportEvent(eventType, { auth_method: this.userAuthMethod });
    }
  }

  private reportEvent(eventType: FleetAnalyticsEventType, props: CustomAnalyticsPropertiesDto = {}): void {
    this.analytics.reportEvent<AnalyticsUserRole>(eventType, { user_access: this.userRole, ...props });
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    const errorKey =
      error.status === HttpStatusCode.Conflict
        ? 'Auth.ResetPassword.Notifications.PasswordIsAlreadyUsed'
        : 'Auth.ResetPassword.Notifications.Error';

    this.reportError(error);
    this.toastService.error(this.translateService.instant(errorKey));
    return throwError(() => error);
  }

  private reportError(error: HttpErrorResponse): void {
    this.analytics.reportEvent<AnalyticsError>(FleetAnalyticsEventType.PROFILE_CHANGE_PASSWORD_POPUP_ERROR, {
      user_access: this.userRole,
      error_code: error.status,
      error_text: error.message,
    });
  }
}
