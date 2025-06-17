import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatDivider } from '@angular/material/divider';
import { MatIcon } from '@angular/material/icon';
import { AccountDto, AnalyticsUserRole, AuthMethod, FleetAnalyticsEventType } from '@data-access';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { AnalyticsService } from '@ui/core/services/analytics.service';
import { AuthService } from '@ui/core/services/auth.service';
import { StorageService, userRoleKey } from '@ui/core/services/storage.service';
import { AccountState } from '@ui/core/store/account/account.reducer';
import { account, getSelectedFleet } from '@ui/core/store/account/account.selectors';
import { getUserAgreementLink } from '@ui/core/store/root/root.selectors';
import { ChangePasswordComponent } from '@ui/modules/account/dialogs/change-password/change-password.component';
import { UIService } from '@ui/shared';
import { InfoPanelComponent } from '@ui/shared/modules/info-panel/components/info-panel/info-panel.component';
import { Id2ColorPipe } from '@ui/shared/pipes/id-2-color/id-2-color.pipe';
import { BehaviorSubject, combineLatest, map, Observable, switchMap } from 'rxjs';
import { filter } from 'rxjs/operators';

import { UklAngularCoreModule } from '@uklon/angular-core';

@Component({
  selector: 'upf-account-details',
  standalone: true,
  imports: [
    AsyncPipe,
    Id2ColorPipe,
    TranslateModule,
    MatDivider,
    MatIcon,
    MatIconButton,
    InfoPanelComponent,
    UklAngularCoreModule,
  ],
  templateUrl: './account-details.component.html',
  styleUrls: ['./account-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountDetailsComponent implements OnDestroy {
  public readonly accountInfo$: Observable<AccountDto> = this.accountStore.select(account).pipe(filter(Boolean));
  public readonly selectedFleet$ = this.accountStore.select(getSelectedFleet);
  public readonly userAgreementLink$: Observable<string> = this.accountStore.select(getUserAgreementLink);
  public readonly userRole = this.storage.get(userRoleKey) || '';
  public readonly authMethod = AuthMethod;
  public readonly getAuthMethod$ = new BehaviorSubject<void>(null);
  public readonly userAuthMethod$ = combineLatest([this.accountInfo$, this.getAuthMethod$]).pipe(
    switchMap(([{ phone }]) => this.getAuthMethod(phone)),
  );

  constructor(
    private readonly matDialog: MatDialog,
    private readonly accountStore: Store<AccountState>,
    private readonly uiService: UIService,
    private readonly analytics: AnalyticsService,
    private readonly storage: StorageService,
    private readonly authService: AuthService,
  ) {
    this.setShellConfig();
    this.analytics.reportEvent<AnalyticsUserRole>(FleetAnalyticsEventType.PROFILE_SCREEN, {
      user_access: this.userRole,
    });
  }

  public ngOnDestroy(): void {
    this.uiService.resetConfig();
  }

  public onChangePassword(authMethod: AuthMethod): void {
    this.analytics.reportEvent(FleetAnalyticsEventType.PROFILE_CHANGE_PASSWORD_POPUP, {
      user_access: this.userRole,
      auth_method: authMethod,
    });

    this.matDialog
      .open(ChangePasswordComponent, {
        panelClass: 'mat-dialog-no-padding',
        data: authMethod,
      })
      .afterClosed()
      .pipe(filter((res) => !!res && authMethod === AuthMethod.SMS))
      .subscribe(() => this.getAuthMethod$.next());
  }

  private getAuthMethod(phone: string): Observable<AuthMethod> {
    return this.authService.getAuthConfirmationMethod(phone).pipe(map(({ method }) => method));
  }

  private setShellConfig(): void {
    this.uiService.setConfig({
      header: {
        title: true,
        backNavigationButton: false,
      },
    });
  }
}
