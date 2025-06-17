import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserCountryExistGuard } from '@ui/core/guards/user-country-exist.guard';
import { CorePaths } from '@ui/core/models/core-paths';
import { StorageService } from '@ui/core/services/storage.service';
import { AuthPaths } from '@ui/modules/auth/models/auth-paths';

import { BaseAuthenticationStorage } from '@uklon/fleets/fleets-app/authentication/domain';

const routes: Routes = [
  {
    path: CorePaths.EMPTY,
    loadComponent: async () =>
      import('./components/login/login.component').then(({ LoginComponent }) => LoginComponent),
    canActivate: [UserCountryExistGuard],
    children: [
      { path: CorePaths.EMPTY, pathMatch: CorePaths.FULL, redirectTo: AuthPaths.LOGIN },
      {
        path: AuthPaths.FORBIDDEN,
        loadComponent: async () =>
          import('./components/forbidden/forbidden.component').then(({ ForbiddenComponent }) => ForbiddenComponent),
      },
      {
        path: AuthPaths.LOGIN,
        loadComponent: async () =>
          import('./components/login-phone/login-phone.component').then(
            ({ LoginPhoneComponent }) => LoginPhoneComponent,
          ),
      },
      {
        path: AuthPaths.PASSWORD,
        loadComponent: async () =>
          import('./components/login-password/login-password.component').then(
            ({ LoginPasswordComponent }) => LoginPasswordComponent,
          ),
      },
    ],
  },
  { path: CorePaths.UNKNOWN, redirectTo: CorePaths.EMPTY },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [{ provide: BaseAuthenticationStorage, useExisting: StorageService }],
})
export class AuthRoutingModule {}
