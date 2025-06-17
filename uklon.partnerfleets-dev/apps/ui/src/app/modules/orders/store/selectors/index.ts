import { createFeatureSelector } from '@ngrx/store';
import { ORDERS_FEATURE_STATE_NAME, OrdersModuleState } from '@ui/modules/orders/store/reducers';

export const getOrdersModuleState = createFeatureSelector<OrdersModuleState>(ORDERS_FEATURE_STATE_NAME);
