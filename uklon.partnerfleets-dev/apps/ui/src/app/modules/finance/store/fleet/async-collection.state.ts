import { CollectionState } from './collection.state';

export interface AsyncCollectionState<T> extends CollectionState<T> {
  state: 'pending' | 'done';
}
