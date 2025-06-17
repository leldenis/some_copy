import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { CorePaths } from '@ui/core/models/core-paths';
import { DriversTabsComponent } from '@ui/modules/drivers/containers/drivers-tabs/drivers-tabs.component';
import { driverDetailsExistGuard } from '@ui/modules/drivers/features/driver-details/guards/driver-details-exist.guard';
import { driverPhotoControlFormResolver } from '@ui/modules/drivers/features/driver-photo-control/resolvers';
import { DriverPaths } from '@ui/modules/drivers/models/driver-paths';
import { VehiclesEffects } from '@ui/modules/vehicles/store/vehicles/vehicles.effects';
import { vehiclesReducer } from '@ui/modules/vehicles/store/vehicles/vehicles.reducer';
import { paginationReducer } from '@ui/shared/components/pagination/store/pagination.reducer';
import { paginationStoreName } from '@ui/shared/components/pagination/store/pagination.selectors';

import { DriversEffects, driversReducer } from './store';

const routes: Routes = [
  {
    path: CorePaths.EMPTY,
    children: [
      {
        path: CorePaths.EMPTY,
        component: DriversTabsComponent,
      },
      {
        path: `${DriverPaths.DETAILS}/${DriverPaths.DRIVER_ID}`,
        canActivate: [driverDetailsExistGuard],
        loadComponent: async () =>
          import('./features/driver-details/pages/driver-details-page/driver-details-page.component').then(
            ({ DriverDetailsPageComponent }) => DriverDetailsPageComponent,
          ),
      },
      {
        path: `${DriverPaths.PHOTO_CONTROL}/${DriverPaths.TICKET_ID}`,
        resolve: { data: driverPhotoControlFormResolver },
        loadComponent: async () =>
          import(
            './features/driver-photo-control/components/driver-photo-control-form/driver-photo-control-form.component'
          ).then(({ DriverPhotoControlFormComponent }) => DriverPhotoControlFormComponent),
      },
    ],
  },
  { path: CorePaths.UNKNOWN, redirectTo: CorePaths.EMPTY },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    StoreModule.forFeature(paginationStoreName, paginationReducer),
    StoreModule.forFeature('drivers', driversReducer),
    EffectsModule.forFeature([DriversEffects]),
    StoreModule.forFeature('vehicles', vehiclesReducer),
    EffectsModule.forFeature([VehiclesEffects]),
  ],
  exports: [RouterModule],
})
export class DriversRoutingModule {}
