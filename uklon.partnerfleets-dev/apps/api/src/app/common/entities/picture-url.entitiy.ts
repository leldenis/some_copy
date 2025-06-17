import { PictureUrlDto } from '@data-access';
import { ApiProperty } from '@nestjs/swagger';

export class PictureUrlDtoEntity implements PictureUrlDto {
  @ApiProperty({ type: String })
  public fallback_url: string;

  @ApiProperty({ type: String })
  public url: string;
}
