import { createAction, props } from '@ngrx/store';
import { PaginationDto } from '@ui/shared/models/pagination.dto';

const tag = '[pagination]';

export const paginationActions = {
  setPagination: createAction(`${tag} set pagination`, props<PaginationDto>()),
  clearState: createAction(`${tag} clear pagination`),
};
