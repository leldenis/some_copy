import { createSelector } from '@ngrx/store';
import { OrdersModuleState } from '@ui/modules/orders/store/reducers';
import { OrdersReportsFeatureState } from '@ui/modules/orders/store/reducers/orders-reports.reducer';
import { getOrdersModuleState } from '@ui/modules/orders/store/selectors/index';

export const ordersReportsFeatureSelector = createSelector(
  getOrdersModuleState,
  (state: OrdersModuleState) => state?.ordersReports,
);

export const getReports = createSelector(
  ordersReportsFeatureSelector,
  (state: OrdersReportsFeatureState) => state?.reports,
);

export const getReportsQueryParams = createSelector(
  ordersReportsFeatureSelector,
  (state: OrdersReportsFeatureState) => state?.reportsQueryParams,
);

export const getReportsLoading = createSelector(
  ordersReportsFeatureSelector,
  (state: OrdersReportsFeatureState) => state?.loading,
);

export const getReportsHasNextPage = createSelector(
  ordersReportsFeatureSelector,
  (state: OrdersReportsFeatureState) => state?.hasNext,
);
