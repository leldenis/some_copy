import { InfinityScrollCollectionDto } from '@data-access';
import { ApiProperty } from '@nestjs/swagger';

export class InfinityScrollCollectionEntity<T> implements InfinityScrollCollectionDto<T> {
  @ApiProperty({ type: Boolean })
  public has_more_items: boolean;

  @ApiProperty({ isArray: true })
  public items: T[];
}
