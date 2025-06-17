export interface PaginationCollectionDto<T> {
  total_count: number;
  items: T[];
}
