import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@ui/core/guards/auth.guard';
import { CorePaths } from '@ui/core/models/core-paths';
import { CouriersFleetGuard, VehiclesFleetGuard } from '@ui/modules/shell/guards';
import { TitleResolver } from '@ui/modules/shell/services/title.resolver';
import { ShellComponent } from '@ui/modules/shell/shell.component';

const routes: Routes = [
  {
    path: CorePaths.EMPTY,
    component: ShellComponent,
    children: [
      {
        path: CorePaths.EMPTY,
        pathMatch: CorePaths.FULL,
        redirectTo: CorePaths.GENERAL,
      },
      {
        path: CorePaths.ACCOUNT,
        title: TitleResolver,
        canActivate: [AuthGuard],
        loadComponent: async () =>
          import('@ui/modules/account/components/account-details/account-details.component').then(
            ({ AccountDetailsComponent }) => AccountDetailsComponent,
          ),
      },
      {
        path: CorePaths.GENERAL,
        title: TitleResolver,
        canActivate: [AuthGuard, VehiclesFleetGuard],
        loadComponent: async () =>
          import('@ui/modules/general/containers/general/general.component').then(
            ({ GeneralComponent }) => GeneralComponent,
          ),
      },
      {
        path: CorePaths.DRIVERS,
        title: TitleResolver,
        canActivate: [AuthGuard, VehiclesFleetGuard],
        loadChildren: async () =>
          import('@ui/modules/drivers/drivers-routing.module').then((m) => m.DriversRoutingModule),
      },
      {
        path: CorePaths.VEHICLES,
        title: TitleResolver,
        canActivate: [AuthGuard, VehiclesFleetGuard],
        loadChildren: async () => import('@ui/modules/vehicles/vehicles.module').then((m) => m.VehiclesModule),
      },
      {
        path: CorePaths.LIVE_MAP,
        title: TitleResolver,
        canActivate: [AuthGuard, VehiclesFleetGuard],
        loadComponent: async () =>
          import('@ui/modules/live-map/containers/map-container/map-container.component').then(
            ({ MapContainerComponent }) => MapContainerComponent,
          ),
      },
      {
        path: CorePaths.ORDERS,
        title: TitleResolver,
        canActivate: [AuthGuard, VehiclesFleetGuard],
        loadChildren: async () => import('@ui/modules/orders/orders.module').then((m) => m.OrdersModule),
      },
      {
        path: CorePaths.FINANCE,
        title: TitleResolver,
        canActivate: [AuthGuard, VehiclesFleetGuard],
        loadChildren: async () => import('@ui/modules/finance/finance.module').then((m) => m.FinanceModule),
      },
      {
        path: CorePaths.FEEDBACKS,
        title: TitleResolver,
        canActivate: [AuthGuard, VehiclesFleetGuard],
        loadComponent: async () =>
          import('@ui/modules/feedback/pages/feedback/feedback.component').then(
            ({ FeedbackComponent }) => FeedbackComponent,
          ),
      },
      {
        path: CorePaths.FLEET_FORBIDDEN,
        title: TitleResolver,
        canActivate: [AuthGuard],
        loadComponent: async () =>
          import('@ui/modules/fleet/pages/fleet-forbidden-page/fleet-forbidden-page.component').then(
            ({ FleetForbiddenPageComponent }) => FleetForbiddenPageComponent,
          ),
      },
      {
        path: CorePaths.COURIERS,
        title: TitleResolver,
        canActivate: [AuthGuard, CouriersFleetGuard],
        loadChildren: async () => import('@ui/modules/couriers/couriers.module').then((m) => m.CouriersModule),
      },
      {
        path: CorePaths.COURIERS_MAP,
        title: TitleResolver,
        canActivate: [AuthGuard, CouriersFleetGuard],
        loadComponent: async () =>
          import(
            '@ui/modules/couriers-live-map/containers/couriers-map-container/couriers-map-container.component'
          ).then(({ CouriersMapContainerComponent }) => CouriersMapContainerComponent),
      },
      {
        path: CorePaths.COURIERS_ORDERS,
        title: TitleResolver,
        canActivate: [AuthGuard, CouriersFleetGuard],
        loadChildren: async () =>
          import('@ui/modules/couriers-orders/couriers-orders.module').then((m) => m.CouriersOrdersModule),
      },
      {
        path: CorePaths.COURIERS_FINANCE,
        title: TitleResolver,
        canActivate: [AuthGuard, CouriersFleetGuard],
        loadChildren: async () =>
          import('@ui/modules/couriers-finance/couriers-finance.module').then((m) => m.CouriersFinanceModule),
      },
      {
        path: CorePaths.COURIERS_FEEDBACKS,
        title: TitleResolver,
        canActivate: [AuthGuard, CouriersFleetGuard],
        loadComponent: async () =>
          import(
            '@ui/modules/couriers-feedbacks/containers/couriers-feedbacks-container/couriers-feedbacks-container.component'
          ).then(({ CouriersFeedbacksContainerComponent }) => CouriersFeedbacksContainerComponent),
      },
      {
        path: CorePaths.FLEET_PROFILE,
        title: TitleResolver,
        canActivate: [AuthGuard],
        loadChildren: async () =>
          import('@ui/modules/fleet-profile/fleet-profile.module').then((m) => m.FleetProfileModule),
      },
      {
        path: CorePaths.BONUSES,
        title: TitleResolver,
        canActivate: [AuthGuard],
        loadComponent: async () =>
          import('@ui/modules/bonuses/containers/bonus-tabs/bonus-tabs.component').then(
            ({ BonusTabsComponent }) => BonusTabsComponent,
          ),
      },
    ],
  },
  {
    path: CorePaths.UNKNOWN,
    redirectTo: CorePaths.EMPTY,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShellRoutingModule {}
