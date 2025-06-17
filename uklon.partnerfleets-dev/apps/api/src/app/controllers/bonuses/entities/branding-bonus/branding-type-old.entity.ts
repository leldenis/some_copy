import { BrandingTypeOldDto } from '@data-access';
import { ApiProperty } from '@nestjs/swagger';

export class BrandingTypeOldEntity implements BrandingTypeOldDto {
  @ApiProperty({ type: String, isArray: true })
  public types: string[];

  @ApiProperty({ type: String })
  public calculation_id: string;
}
