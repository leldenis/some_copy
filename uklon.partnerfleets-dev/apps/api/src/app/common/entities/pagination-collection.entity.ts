import { PaginationCollectionDto } from '@data-access';
import { ApiProperty } from '@nestjs/swagger';

export class PaginationCollectionEntity<T> implements PaginationCollectionDto<T> {
  @ApiProperty({ type: Number })
  public total_count: number;

  public items: T[];
}
