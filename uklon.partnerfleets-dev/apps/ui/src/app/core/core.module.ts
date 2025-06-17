import { APP_INITIALIZER, importProvidersFrom, NgModule, Optional, SkipSelf } from '@angular/core';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { HammerModule } from '@angular/platform-browser';
import { AuthGuard } from '@ui/core/guards/auth.guard';
import { IconsModule } from '@ui/core/icons.module';
import { AccountService } from '@ui/core/services/account.service';
import { AppTranslateService } from '@ui/core/services/app-translate.service';
import { AppService } from '@ui/core/services/app.service';
import { AuthService } from '@ui/core/services/auth.service';
import { GoogleTagManagerService } from '@ui/core/services/google-tag-manager.service';
import { ReferencesService } from '@ui/core/services/references.service';
import { StorageService } from '@ui/core/services/storage.service';
import { ToastService } from '@ui/core/services/toast.service';
import { WebsocketService } from '@ui/core/services/websocket.service';
import { AppStoreModule } from '@ui/core/store/app-store.module';
import { TranslationModule } from '@ui/core/translation.module';

import { SentryModule } from '@uklon/angular-sentry';

import { httpInterceptors } from './interceptors';

@NgModule({
  imports: [AppStoreModule, TranslationModule, IconsModule, MatSnackBarModule, HammerModule, MatDialogModule],
  providers: [
    AppService,
    WebsocketService,
    AppTranslateService,
    AuthService,
    StorageService,
    AccountService,
    ReferencesService,
    ToastService,
    AuthGuard,
    ...httpInterceptors,
    {
      provide: APP_INITIALIZER,
      deps: [AppService],
      multi: true,
      useFactory: (appService: AppService) => async () => appService.initialize(),
    },
    importProvidersFrom(SentryModule.forRoot()),
    {
      provide: MAT_DATE_LOCALE,
      useValue: 'uk-UA',
    },
    GoogleTagManagerService,
  ],
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error('CoreModule has already been loaded. Import Core modules in the AppModule only');
    }
  }
}
