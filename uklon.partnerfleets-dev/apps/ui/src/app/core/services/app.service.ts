import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { RefinerIntegrationService } from '@ui/core';
import { UserDto } from '@ui/core/models/user.dto';
import { AccountService } from '@ui/core/services/account.service';
import { AppTranslateService } from '@ui/core/services/app-translate.service';
import { StorageService, storageUserKey } from '@ui/core/services/storage.service';
import { accountActions } from '@ui/core/store/account/account.actions';
import { AppState } from '@ui/core/store/app.state';
import { authActions } from '@ui/core/store/auth/auth.actions';
import { rootActions } from '@ui/core/store/root/root.actions';
import { EnvironmentModel } from '@ui-env/environment.model';
import { take, tap } from 'rxjs/operators';

import { APP_CONFIG, APP_VERSION, AppVersion } from '@uklon/angular-core';
import { initSentry } from '@uklon/angular-sentry';

@Injectable()
export class AppService {
  private readonly store = inject(Store<AppState>);
  private readonly storageService = inject(StorageService);
  private readonly appTranslateService = inject(AppTranslateService);
  private readonly refinerService = inject(RefinerIntegrationService);
  private readonly accountService = inject(AccountService);
  private readonly appConfig = inject<EnvironmentModel>(APP_CONFIG);
  private readonly appVersion: AppVersion = inject<AppVersion>(APP_VERSION);

  constructor() {
    this.storageService.getOrCreateDeviceId();
  }

  public async initialize(): Promise<void> {
    return new Promise((resolve) => {
      if (this.appConfig) {
        this.store.dispatch(rootActions.setConfig(this.appConfig));
      }

      if (this.appConfig?.sentry?.isActive && this.appConfig?.sentry?.dsn) {
        initSentry({
          dsn: this.appConfig.sentry.dsn,
          release: this.appVersion?.ver,
        });
      }

      if (this.appConfig?.refinerIntegration?.enabled) {
        this.refinerService.initialize();
      }

      this.accountService
        .getAvailableLanguages()
        .pipe(
          tap(({ allowed, default: defaultLanguage }) => {
            this.appTranslateService.setDefaults({
              available: allowed,
              default: defaultLanguage,
              fallbacks: this.appConfig?.language.fallbacks,
            });

            this.tryRestoreSession();
          }),
          take(1),
        )
        .subscribe(() => resolve());
    });
  }

  private tryRestoreSession(): void {
    const user: UserDto = this.storageService.get(storageUserKey);

    if (user) {
      this.store.dispatch(authActions.setUser(user));
      this.store.dispatch(accountActions.getAccountInfo());
    }
  }
}
