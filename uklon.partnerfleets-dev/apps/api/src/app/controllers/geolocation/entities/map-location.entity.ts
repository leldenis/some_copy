import { LiveMapLocationDto } from '@data-access';
import { ApiProperty } from '@nestjs/swagger';

export class MapLocationEntity implements LiveMapLocationDto {
  @ApiProperty({ type: Number })
  public latitude: number;

  @ApiProperty({ type: Number })
  public longitude: number;
}
