import { ModelsDictionaryDto } from '@data-access';
import { ApiProperty } from '@nestjs/swagger';

export class ModelsDictionaryEntity implements ModelsDictionaryDto {
  @ApiProperty({ type: String })
  public id: string;

  @ApiProperty({ type: String })
  public name: string;

  @ApiProperty({ type: String })
  public make_id: string;

  @ApiProperty({ type: Boolean })
  public is_active: boolean;
}
