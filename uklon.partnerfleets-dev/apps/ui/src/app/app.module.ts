import { CommonModule } from '@angular/common';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { isDevMode, NgModule } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ATTR_SERVICE_VERSION } from '@opentelemetry/semantic-conventions';
import { CoreModule } from '@ui/core/core.module';
import { NotificationCenterSidenavComponent } from '@ui/modules/notification-center/components';
import { CustomToastComponent } from '@ui/shared/components/custom-toast/custom-toast.component';
import { LoadingIndicatorComponent } from '@ui/shared/components/loading-indicator/loading-indicator.component';
import { environment } from '@ui-env/environment';
import { provideNgxMask } from 'ngx-mask';
import { ToastrModule } from 'ngx-toastr';

import { AppClient, AppVersion, UklAngularCoreModule, UklWindow } from '@uklon/angular-core';
import { provideOpentelemetry } from '@uklon/angular-opentelemetry';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MaterialOptionsModule } from './modules/material-options/material-options.module';

const DEFAULT_VERSION: AppVersion = { ver: '0.0.0', rev: 'dev', build: 'dev' };

const getAppClient = (): AppClient => (window as UklWindow)?.appClient;

@NgModule({
  declarations: [AppComponent],
  bootstrap: [AppComponent],
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    UklAngularCoreModule.forRoot({
      defaultConfig: environment,
      defaultVersion: DEFAULT_VERSION,
    }),
    CoreModule,
    LoadingIndicatorComponent,
    MaterialOptionsModule,
    MatSidenavModule,
    NotificationCenterSidenavComponent,
    MatIconButton,
    MatIcon,
    ToastrModule.forRoot({
      closeButton: true,
      disableTimeOut: true,
      maxOpened: 3,
      autoDismiss: true,
      toastComponent: CustomToastComponent,
      tapToDismiss: false,
      enableHtml: true,
      toastClass: 'custom-toast',
    }),
  ],
  providers: [
    provideHttpClient(withInterceptorsFromDi()),
    ...(isDevMode()
      ? []
      : [
          provideOpentelemetry({
            commonConfig: {
              console: false,
              production: true,
              logBody: false,
              serviceName: 'PartnerFleetsUI',
              probabilitySampler: getAppClient()?.config?.opentelemetry?.probabilitySampler || '0.1',
              resourceAttributes: {
                [ATTR_SERVICE_VERSION]: (getAppClient()?.version || DEFAULT_VERSION)?.ver,
              },
            },
            otelcolConfig: {
              url: `${window.location.origin}/traces`,
            },
          }),
        ]),
    provideNgxMask(),
  ],
})
export class AppModule {}
