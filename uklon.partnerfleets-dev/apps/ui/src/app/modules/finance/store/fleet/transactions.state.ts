import { TransactionDto } from '@data-access';

import { AsyncCollectionState } from './async-collection.state';
import { PaginationState } from './pagination.state';

export interface TransactionsState {
  transactions: AsyncCollectionState<TransactionDto> & PaginationState<boolean>;
}
