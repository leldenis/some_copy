import { MakesDictionaryDto } from '@data-access';
import { ApiProperty } from '@nestjs/swagger';

export class MakesDictionaryEntity implements MakesDictionaryDto {
  @ApiProperty({ type: String })
  public id: string;

  @ApiProperty({ type: String })
  public name: string;

  @ApiProperty({ type: Boolean })
  public is_active: boolean;
}
