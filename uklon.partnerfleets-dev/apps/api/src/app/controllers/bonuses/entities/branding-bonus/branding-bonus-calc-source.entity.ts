import { BrandingBonusOrderSourceEntity } from '@api/controllers/bonuses/entities/branding-bonus/branding-bonus-order-source.entity';
import { BrandingBonusCalcSourceDto, BrandingBonusOrderSourceDto } from '@data-access';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class BrandingBonusCalcSourceEntity implements BrandingBonusCalcSourceDto {
  @ApiPropertyOptional({ type: Number })
  public rating?: number;

  @ApiProperty({ type: BrandingBonusOrderSourceEntity })
  public orders: BrandingBonusOrderSourceDto;
}
