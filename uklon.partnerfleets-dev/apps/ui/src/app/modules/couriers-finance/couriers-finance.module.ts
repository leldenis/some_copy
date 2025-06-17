import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { CorePaths } from '@ui/core/models/core-paths';

import { driversReducer, DriversEffects } from '../drivers/store';
import { financeReducer, FinanceEffects } from '../finance/store';

import { CouriersFinanceContainerComponent } from './containers/couriers-finance-container/couriers-finance-container.component';

const routes: Routes = [
  {
    path: CorePaths.EMPTY,
    component: CouriersFinanceContainerComponent,
  },
  { path: CorePaths.UNKNOWN, redirectTo: '' },
];

@NgModule({
  imports: [
    StoreModule.forFeature('finance', financeReducer),
    EffectsModule.forFeature([FinanceEffects]),
    StoreModule.forFeature('drivers', driversReducer),
    EffectsModule.forFeature([DriversEffects]),
    RouterModule.forChild(routes),
  ],
  exports: [RouterModule],
})
export class CouriersFinanceModule {}
