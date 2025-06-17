import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { CorePaths } from '@ui/core/models/core-paths';
import { VehiclesPageComponent } from '@ui/modules/vehicles/containers/vehicles-page/vehicles-page.component';
import { VehiclesRootPageComponent } from '@ui/modules/vehicles/containers/vehicles-root-page/vehicles-root-page.component';
import { cancelVideoUploadGuard } from '@ui/modules/vehicles/features/vehicle-branding-period-tickets/guards';
import { vehicleBrandingPeriodControlFormResolver } from '@ui/modules/vehicles/features/vehicle-branding-period-tickets/resolvers';
import { ticketConfigByRegionResolver } from '@ui/modules/vehicles/features/vehicle-creation/resolvers/ticket-config-by-region.resolver';
import { ticketExistResolver } from '@ui/modules/vehicles/features/vehicle-ticket-details/resolvers/ticket-exist.resolver';
import { VehiclePaths } from '@ui/modules/vehicles/models/vehicle-paths';
import { paginationReducer } from '@ui/shared/components/pagination/store/pagination.reducer';
import { paginationStoreName } from '@ui/shared/components/pagination/store/pagination.selectors';

import { DesktopGuard } from './guards/desktop.guard';

const routes: Routes = [
  {
    path: CorePaths.EMPTY,
    component: VehiclesRootPageComponent,
    children: [
      {
        path: CorePaths.EMPTY,
        component: VehiclesPageComponent,
        canDeactivate: [cancelVideoUploadGuard()],
      },
      {
        path: `${VehiclePaths.DETAILS}/${VehiclePaths.VEHICLE_ID}`,
        loadComponent: async () =>
          import('./features/vehicle-details/pages/vehicle-details-page.component').then(
            ({ VehicleDetailsPageComponent }) => VehicleDetailsPageComponent,
          ),
      },
      {
        path: VehiclePaths.CREATE,
        resolve: { data: ticketConfigByRegionResolver },
        loadComponent: async () =>
          import(
            './features/vehicle-creation/containers/vehicle-creation-container/vehicle-creation-container.component'
          ).then(({ VehicleCreationContainerComponent }) => VehicleCreationContainerComponent),
      },
      {
        path: `${VehiclePaths.TICKET}/${VehiclePaths.TICKET_ID}`,
        resolve: { data: ticketExistResolver },
        loadComponent: async () =>
          import(
            '@ui/modules/vehicles/features/vehicle-ticket-details/containers/vehicle-ticket-container/vehicle-ticket-container.component'
          ).then(({ VehicleTicketContainerComponent }) => VehicleTicketContainerComponent),
      },
      {
        path: `${VehiclePaths.PHOTO_CONTROL}/${VehiclePaths.TICKET_ID}`,
        loadChildren: async () =>
          import('./features/vehicle-photo-control/vehicle-photo-control.module').then(
            (m) => m.VehiclePhotoControlModule,
          ),
        canActivate: [DesktopGuard],
      },
      {
        path: `${VehiclePaths.VEHICLE_ID}/${VehiclePaths.BRANDING_PERIOD_CONTROL}/${VehiclePaths.TICKET_ID}`,
        loadComponent: async () =>
          import('./features/vehicle-branding-period-tickets/containers').then(
            ({ VehicleBrandingPeriodControlFormComponent }) => VehicleBrandingPeriodControlFormComponent,
          ),
        canDeactivate: [cancelVideoUploadGuard('VehicleBrandingPeriod.CancelVideoUploadDialog.MessageSingle')],
        resolve: { data: vehicleBrandingPeriodControlFormResolver },
      },
      {
        path: `${VehiclePaths.VEHICLE_ID}/${VehiclePaths.BRANDING_PERIOD_CONTROL}/${VehiclePaths.TICKET_ID}/${CorePaths.SUCCESS}`,
        loadComponent: async () =>
          import('./features/vehicle-branding-period-tickets/containers').then(
            ({ VehicleBrandingPeriodControlFormSuccessComponent }) => VehicleBrandingPeriodControlFormSuccessComponent,
          ),
      },
    ],
  },
  { path: CorePaths.UNKNOWN, redirectTo: CorePaths.EMPTY },
];

@NgModule({
  imports: [RouterModule.forChild(routes), StoreModule.forFeature(paginationStoreName, paginationReducer)],
  exports: [RouterModule],
})
export class VehiclesRoutingModule {}
