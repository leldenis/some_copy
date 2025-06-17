import { RangeIntegerEntity } from '@api/controllers/bonuses/entities/branding-bonus/branding-bonus-spec-old.entity';
import { BrandingBonusCalculationPeriodDto, RangeItemsDto } from '@data-access';
import { ApiProperty } from '@nestjs/swagger';

export class BrandingBonusCalculationPeriodEntity implements BrandingBonusCalculationPeriodDto {
  @ApiProperty({ type: String })
  public calculation_id: string;

  @ApiProperty({ type: RangeIntegerEntity })
  public period: RangeItemsDto;

  @ApiProperty({ type: Number })
  public calculation_created_at: number;

  @ApiProperty({ type: String, isArray: true })
  public branding_types: string[];
}
