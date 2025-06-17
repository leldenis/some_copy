import { CollectionDto } from '@data-access';
import { ApiProperty } from '@nestjs/swagger';

export class NotificationsIdsCollectionEntity implements CollectionDto<string> {
  @ApiProperty({ type: String, isArray: true })
  public items: string[];
}
