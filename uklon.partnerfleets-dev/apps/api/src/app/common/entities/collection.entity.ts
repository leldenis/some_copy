import { CollectionDto } from '@data-access';
import { ApiProperty } from '@nestjs/swagger';

export class CollectionEntity<T> implements CollectionDto<T> {
  @ApiProperty({ isArray: true })
  public items: T[];
}
