import { CollectionCursorDto } from '@data-access';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CollectionCursorEntity<T> implements CollectionCursorDto<T> {
  @ApiProperty({ type: String })
  public next_cursor: string;

  @ApiPropertyOptional({ type: String })
  public previous_cursor?: string;

  @ApiProperty({ isArray: true })
  public items: T[];
}
