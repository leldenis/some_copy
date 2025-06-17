import { RangeIntegerEntity } from '@api/controllers/bonuses/entities/branding-bonus/branding-bonus-spec-old.entity';
import { BrandingTypeOldEntity } from '@api/controllers/bonuses/entities/branding-bonus/branding-type-old.entity';
import { BrandingBonusCalculationPeriodOldDto, BrandingTypeOldDto, RangeItemsDto } from '@data-access';
import { ApiProperty } from '@nestjs/swagger';

export class BrandingBonusCalculationPeriodOldEntity implements BrandingBonusCalculationPeriodOldDto {
  @ApiProperty({ type: String })
  public calculation_id: string;

  @ApiProperty({ type: RangeIntegerEntity })
  public period: RangeItemsDto;

  @ApiProperty({ type: Number })
  public calculation_created_at: number;

  @ApiProperty({ type: String, isArray: true })
  public branding_types: string[];

  @ApiProperty({ type: BrandingTypeOldEntity, isArray: true })
  public brandingTypes: BrandingTypeOldDto[];
}
