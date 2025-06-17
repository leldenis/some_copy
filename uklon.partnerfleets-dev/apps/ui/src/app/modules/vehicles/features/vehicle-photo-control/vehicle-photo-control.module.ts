import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  VehiclePhotoControlFormComponent,
  VehiclePhotoControlSuccessComponent,
} from '@ui/modules/vehicles/features/vehicle-photo-control/components';
import { vehiclePhotoControlResolver } from '@ui/modules/vehicles/features/vehicle-photo-control/resolvers/vehicle-photo-control.resolver';

const routes: Routes = [
  {
    path: '',
    component: VehiclePhotoControlFormComponent,
    resolve: { data: vehiclePhotoControlResolver },
  },
  {
    path: 'success',
    component: VehiclePhotoControlSuccessComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VehiclePhotoControlModule {}
