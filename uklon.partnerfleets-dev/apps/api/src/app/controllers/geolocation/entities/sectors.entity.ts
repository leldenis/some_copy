import { SectorTagDto, SectorTagName } from '@data-access';
import { ApiProperty } from '@nestjs/swagger';

export class SectorTagEntity implements SectorTagDto {
  @ApiProperty({ type: String })
  public name: SectorTagName;

  @ApiProperty({ type: String })
  public value: string;
}
