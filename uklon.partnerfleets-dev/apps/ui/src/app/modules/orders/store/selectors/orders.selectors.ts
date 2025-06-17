import { FleetOrderRecordDto } from '@data-access';
import { createSelector } from '@ngrx/store';
import { CorePaths } from '@ui/core/models/core-paths';
import { getRouterUrl } from '@ui/core/store/router/router.selector';
import { OrdersPaths } from '@ui/modules/orders/models/orders-paths';
import { OrdersModuleState } from '@ui/modules/orders/store/reducers';
import { getOrdersModuleState } from '@ui/modules/orders/store/selectors/index';

import { InfiniteCollectionState, OrdersFeatureState, ProgressState } from '../reducers/orders.reducer';

export const ordersFeatureSelector = createSelector(getOrdersModuleState, (state: OrdersModuleState) => state?.orders);

export const selectOrderRecordCollection = createSelector(
  ordersFeatureSelector,
  (state: OrdersFeatureState) =>
    ({
      ...state.collection,
      ...state.progress,
    }) as InfiniteCollectionState<FleetOrderRecordDto> & ProgressState,
);

export const selectError = createSelector(ordersFeatureSelector, (state: OrdersFeatureState) => state?.error);

export const selectQuery = createSelector(ordersFeatureSelector, (state: OrdersFeatureState) => state?.query);

export const selectOrder = createSelector(ordersFeatureSelector, (state: OrdersFeatureState) => state?.order);

export const getIsOrderDetailsPages = createSelector(getRouterUrl, (url: string) =>
  url?.includes(`/${CorePaths.WORKSPACE}/${CorePaths.ORDERS}/${OrdersPaths.DETAILS}`),
);
