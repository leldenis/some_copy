import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { DriversEffects } from '@ui/modules/drivers/store/drivers/drivers.effects';
import { driversReducer } from '@ui/modules/drivers/store/drivers/drivers.reducer';
import { OrdersModuleEffects } from '@ui/modules/orders/store/effects';
import { ORDERS_FEATURE_STATE_NAME, ORDERS_REDUCER_STATES } from '@ui/modules/orders/store/reducers';

import { OrdersRoutingModule } from './orders-routing.module';

@NgModule({
  imports: [
    StoreModule.forFeature(ORDERS_FEATURE_STATE_NAME, ORDERS_REDUCER_STATES),
    EffectsModule.forFeature(OrdersModuleEffects),
    StoreModule.forFeature('drivers', driversReducer),
    EffectsModule.forFeature([DriversEffects]),
    OrdersRoutingModule,
  ],
})
export class OrdersModule {}
