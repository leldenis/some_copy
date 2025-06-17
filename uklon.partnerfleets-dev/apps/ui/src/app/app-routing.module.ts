import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@ui/core/guards/auth.guard';
import { CorePaths } from '@ui/core/models/core-paths';

const routes: Routes = [
  {
    path: CorePaths.WORKSPACE,
    canLoad: [AuthGuard],
    loadChildren: async () => import('@ui/modules/shell/shell.module').then((m) => m.ShellModule),
  },
  {
    path: CorePaths.AUTH,
    loadChildren: async () => import('./modules/auth/auth-routing.module').then((m) => m.AuthRoutingModule),
  },
  {
    path: CorePaths.VEHICLES,
    loadChildren: async () => import('./plugins/vehicles/vehicles-plugin.module').then((m) => m.VehiclesPluginModule),
  },
  {
    path: CorePaths.EMPTY,
    pathMatch: CorePaths.FULL,
    redirectTo: `/${CorePaths.WORKSPACE}/${CorePaths.GENERAL}`,
  },
  { path: CorePaths.UNKNOWN, redirectTo: `/${CorePaths.WORKSPACE}/${CorePaths.GENERAL}` },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'enabled',
      useHash: false,
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
