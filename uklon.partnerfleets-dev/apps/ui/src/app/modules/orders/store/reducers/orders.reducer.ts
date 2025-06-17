import { FleetOrderRecordDto, FleetOrderRecordCollectionQueryDto, OrderRecordDto, getCurrentWeek } from '@data-access';
import { createReducer, on } from '@ngrx/store';
import { omit } from 'lodash';

import { OrdersFeatureActionGroup } from '../actions/orders.actions';

export interface RequestErrorState {
  message?: string;
}

export interface ProgressState {
  status: 'progress' | 'done';
}

export interface InfiniteCollectionState<T> {
  data: T[];
  cursor: number;
  hasNext: boolean;
}

export interface OrdersFeatureState {
  collection: InfiniteCollectionState<FleetOrderRecordDto>;
  progress: ProgressState;
  error: RequestErrorState;
  query: FleetOrderRecordCollectionQueryDto;
  order: OrderRecordDto;
}

const INITIAL_INFINITE_COLLECTION_STATE: InfiniteCollectionState<unknown> = {
  data: [],
  cursor: null,
  hasNext: null,
};

const DEFAULT_LIMIT = 50;

export const INITIAL_QUERY_STATE: FleetOrderRecordCollectionQueryDto = {
  ...getCurrentWeek(),
  fleetId: '',
  driverId: '',
  vehicleId: '',
  licencePlate: '',
  productType: '',
  status: '',
  cursor: -1,
  limit: DEFAULT_LIMIT,
};

export const INITIAL_STATE: OrdersFeatureState = {
  collection: INITIAL_INFINITE_COLLECTION_STATE as InfiniteCollectionState<FleetOrderRecordDto>,
  progress: null,
  error: null,
  order: null,
  query: INITIAL_QUERY_STATE,
};

export const ordersFeatureReducer = createReducer(
  INITIAL_STATE,
  on(OrdersFeatureActionGroup.clear, ({ query }) => ({
    ...INITIAL_STATE,
    query,
  })),
  on(OrdersFeatureActionGroup.collectionChanged, (state, { items, cursor }) => {
    const { query, collection } = state;
    const hasNext = (query?.limit || DEFAULT_LIMIT) === items.length;

    return {
      ...state,
      query: { ...query, cursor },
      error: null,
      progress: { status: 'done' } as ProgressState,
      collection:
        query.cursor > 0
          ? {
              ...collection,
              data: [...collection.data, ...items],
              hasNext,
              cursor,
            }
          : { data: [...items], cursor, hasNext },
    };
  }),
  on(OrdersFeatureActionGroup.queryChanged, (state, action) => ({
    ...state,
    query: omit(action, 'type'),
    progress: { status: 'progress' } as ProgressState,
  })),
  on(OrdersFeatureActionGroup.requestOrder, (state) => ({
    ...state,
    order: null,
  })),
  on(OrdersFeatureActionGroup.setOrder, (state, action) => ({
    ...state,
    order: omit(action, 'type'),
  })),
  on(OrdersFeatureActionGroup.error, (state, action) => ({
    ...state,
    error: omit(action, 'type'),
    collection: INITIAL_INFINITE_COLLECTION_STATE as InfiniteCollectionState<FleetOrderRecordDto>,
    order: null,
  })),
);
