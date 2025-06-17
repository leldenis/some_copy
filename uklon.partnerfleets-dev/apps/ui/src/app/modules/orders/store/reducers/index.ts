import { InjectionToken } from '@angular/core';
import { ActionReducerMap } from '@ngrx/store';
import {
  ordersReportsFeatureReducer,
  OrdersReportsFeatureState,
} from '@ui/modules/orders/store/reducers/orders-reports.reducer';
import { ordersFeatureReducer, OrdersFeatureState } from '@ui/modules/orders/store/reducers/orders.reducer';

export interface OrdersModuleState {
  orders: OrdersFeatureState;
  ordersReports: OrdersReportsFeatureState;
}

const ordersModuleReducer: ActionReducerMap<OrdersModuleState> = {
  orders: ordersFeatureReducer,
  ordersReports: ordersReportsFeatureReducer,
};

export const ORDERS_FEATURE_STATE_NAME = 'orders';
export const ORDERS_REDUCER_STATES = new InjectionToken<ActionReducerMap<OrdersModuleState>>(
  ORDERS_FEATURE_STATE_NAME,
  {
    factory: () => ordersModuleReducer,
  },
);
