import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { DriversEffects, driversReducer } from '@ui/modules/drivers/store';
import { VehiclesEffects, vehiclesReducer } from '@ui/modules/vehicles/store';
import { paginationReducer } from '@ui/shared/components/pagination/store/pagination.reducer';
import { paginationStoreName } from '@ui/shared/components/pagination/store/pagination.selectors';

import { VehiclesRoutingModule } from './vehicles-routing.module';

@NgModule({
  imports: [
    RouterModule,
    StoreModule.forFeature('drivers', driversReducer),
    EffectsModule.forFeature([DriversEffects]),
    StoreModule.forFeature('vehicles', vehiclesReducer),
    EffectsModule.forFeature([VehiclesEffects]),
    StoreModule.forFeature(paginationStoreName, paginationReducer),
    VehiclesRoutingModule,
  ],
})
export class VehiclesModule {}
