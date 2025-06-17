import { createReducer, on } from '@ngrx/store';
import { paginationActions } from '@ui/shared/components/pagination/store/pagination.actions';

export interface PaginationState {
  offset: number;
  limit: number;
}

export const initialState: PaginationState = {
  offset: 0,
  limit: 30,
};

export const paginationReducer = createReducer(
  initialState,

  on(paginationActions.setPagination, (state, payload) => ({
    ...state,
    offset: payload.offset,
    limit: payload.limit,
  })),

  on(paginationActions.clearState, () => ({
    ...initialState,
  })),
);
