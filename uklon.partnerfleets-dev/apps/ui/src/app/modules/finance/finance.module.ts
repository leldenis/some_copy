import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { DriversEffects } from '@ui/modules/drivers/store/drivers/drivers.effects';
import { driversReducer } from '@ui/modules/drivers/store/drivers/drivers.reducer';

import { FinanceRoutingModule } from './finance-routing.module';
import { FinanceEffects, financeReducer } from './store';

@NgModule({
  imports: [
    StoreModule.forFeature('finance', financeReducer),
    EffectsModule.forFeature([FinanceEffects]),
    StoreModule.forFeature('drivers', driversReducer),
    EffectsModule.forFeature([DriversEffects]),
    FinanceRoutingModule,
  ],
})
export class FinanceModule {}
