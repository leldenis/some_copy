import { DriversOrdersReportDto, getCurrentWeek, InfinityScrollCollectionDto } from '@data-access';
import { createReducer, on } from '@ngrx/store';
import { DEFAULT_REPORTS_OFFSET, DEFAULT_REPORTS_QUERY_PARAMS } from '@ui/modules/orders/constants';
import { OrderReports } from '@ui/modules/orders/models/order-reports.dto';
import { DEFAULT_LIMIT } from '@ui/shared/consts';

import { OrderReportsActionsGroup } from '../actions/orders-reports.actions';

export interface OrdersReportsFeatureState {
  reports: DriversOrdersReportDto[];
  reportsQueryParams: OrderReports;
  hasNext: boolean;
  loading: boolean;
}

export const INITIAL_STATE: OrdersReportsFeatureState = {
  reports: [],
  reportsQueryParams: {
    date: getCurrentWeek(),
    driverId: '',
    offset: DEFAULT_REPORTS_OFFSET,
    limit: DEFAULT_LIMIT,
  },
  hasNext: false,
  loading: false,
};

export const ordersReportsFeatureReducer = createReducer(
  INITIAL_STATE,
  on(OrderReportsActionsGroup.getOrdersReports, (state, payload: OrderReports) => ({
    ...state,
    loading: true,
    reportsQueryParams: {
      ...state.reportsQueryParams,
      ...(payload.driverId ? { ...payload, ...DEFAULT_REPORTS_QUERY_PARAMS } : { ...payload }),
    },
    reports: payload.offset === 0 ? [] : state.reports,
  })),

  on(
    OrderReportsActionsGroup.getOrdersReportsSuccess,
    (state, payload: InfinityScrollCollectionDto<DriversOrdersReportDto>) => ({
      ...state,
      loading: false,
      reports: [...state.reports, ...payload.items],
      hasNext: payload.has_more_items,
      reportsQueryParams: {
        ...state.reportsQueryParams,
        offset: state.reportsQueryParams.offset + DEFAULT_LIMIT,
      },
    }),
  ),

  on(OrderReportsActionsGroup.getOrdersReportsFailed, (state) => ({
    loading: false,
    ...state,
  })),
);
