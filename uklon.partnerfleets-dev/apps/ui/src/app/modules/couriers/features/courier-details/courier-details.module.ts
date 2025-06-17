import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { CorePaths } from '@ui/core/models/core-paths';
import { courierDetailsExistGuard } from '@ui/modules/couriers/features/courier-details/guards/courier-details-exist.guard';
import { CourierDetailsPageComponent } from '@ui/modules/couriers/features/courier-details/pages/courier-details-page/courier-details-page.component';
import { CourierDetailsEffects } from '@ui/modules/couriers/features/courier-details/store/courier-details.effects';
import { courierDetailsReducer } from '@ui/modules/couriers/features/courier-details/store/courier-details.reducer';

const routes: Routes = [
  {
    path: CorePaths.EMPTY,
    canActivate: [courierDetailsExistGuard],
    component: CourierDetailsPageComponent,
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    StoreModule.forFeature('courierDetails', courierDetailsReducer),
    EffectsModule.forFeature([CourierDetailsEffects]),
  ],
})
export class CourierDetailsModule {}
