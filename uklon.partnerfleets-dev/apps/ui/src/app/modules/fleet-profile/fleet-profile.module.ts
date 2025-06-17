import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { FleetRROEffects, fleetRROReducer } from '@ui/modules/fleet-profile/features/fleet-rro/store';
import { FleetProfileEffects, fleetProfileReducer } from '@ui/modules/fleet-profile/store';
import { paginationReducer } from '@ui/shared/components/pagination/store/pagination.reducer';
import { paginationStoreName } from '@ui/shared/components/pagination/store/pagination.selectors';

import { FleetProfileRoutingModule } from './fleet-profile-routing.module';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature('fleetProfile', fleetProfileReducer),
    EffectsModule.forFeature([FleetProfileEffects]),
    StoreModule.forFeature('rro', fleetRROReducer),
    StoreModule.forFeature(paginationStoreName, paginationReducer),
    EffectsModule.forFeature([FleetRROEffects]),
    FleetProfileRoutingModule,
  ],
})
export class FleetProfileModule {}
