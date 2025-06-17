export interface CollectionCursorDto<T> {
  items: T[];
  next_cursor: string;
  previous_cursor?: string;
}
