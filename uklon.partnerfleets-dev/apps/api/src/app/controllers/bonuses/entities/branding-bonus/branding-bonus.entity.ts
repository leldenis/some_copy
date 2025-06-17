import { BrandingBonusDto } from '@data-access';
import { ApiProperty } from '@nestjs/swagger';

export class BrandingBonusEntity implements BrandingBonusDto {
  @ApiProperty({ type: Number })
  public value: number;
}
