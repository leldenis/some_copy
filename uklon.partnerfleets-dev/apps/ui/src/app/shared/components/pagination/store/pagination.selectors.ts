import { createFeatureSelector, createSelector } from '@ngrx/store';
import { PaginationState } from '@ui/shared/components/pagination/store/pagination.reducer';

export const paginationStoreName = 'pagination';

export const getPaginationStore = createFeatureSelector<PaginationState>('pagination');

export const getPagination = createSelector(getPaginationStore, (paginationStore: PaginationState) => ({
  limit: paginationStore?.limit,
  offset: paginationStore?.offset,
}));
