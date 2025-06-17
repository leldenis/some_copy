import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreRouterConnectingModule, routerReducer } from '@ngrx/router-store';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { DeviceService } from '@ui/core/services/device.service';
import { AccountEffects } from '@ui/core/store/account/account.effects';
import { accountReducer } from '@ui/core/store/account/account.reducer';
import { AuthEffects } from '@ui/core/store/auth/auth.effects';
import { authReducer } from '@ui/core/store/auth/auth.reducer';
import { ReferencesEffects } from '@ui/core/store/references/references.effects';
import { referencesReducer } from '@ui/core/store/references/references.reducer';
import { RootEffects } from '@ui/core/store/root/root.effects';
import { rootReducer } from '@ui/core/store/root/root.reducer';

@NgModule({
  imports: [
    StoreModule.forRoot(
      {
        root: rootReducer,
        auth: authReducer,
        account: accountReducer,
        references: referencesReducer,
        router: routerReducer,
      },
      {
        runtimeChecks: {
          strictStateSerializability: true,
          strictActionSerializability: true,
          strictStateImmutability: true,
          strictActionImmutability: true,
          strictActionTypeUniqueness: true,
        },
      },
    ),
    StoreRouterConnectingModule.forRoot(),
    EffectsModule.forRoot([RootEffects, AuthEffects, AccountEffects, ReferencesEffects]),
    StoreDevtoolsModule.instrument({ connectInZone: true }),
  ],
  // TODO: Remove after webview decoupling
  providers: [DeviceService],
})
export class AppStoreModule {}
