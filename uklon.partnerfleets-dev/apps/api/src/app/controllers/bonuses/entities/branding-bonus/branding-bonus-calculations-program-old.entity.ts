import {
  BrandingBonusSpecOldEntity,
  RangeIntegerEntity,
} from '@api/controllers/bonuses/entities/branding-bonus/branding-bonus-spec-old.entity';
import { BrandingBonusCalculationsProgramOldDto, BrandingBonusSpecOldDto, RangeItemsDto } from '@data-access';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class BrandingBonusCalculationsProgramOldEntity implements BrandingBonusCalculationsProgramOldDto {
  @ApiProperty({ type: String })
  public id: string;

  @ApiProperty({ type: String })
  public name: string;

  @ApiProperty({ type: RangeIntegerEntity })
  public life_time: RangeItemsDto;

  @ApiProperty({ type: String })
  public status: string;

  @ApiProperty({ type: String })
  public type: string;

  @ApiProperty({ type: BrandingBonusSpecOldEntity })
  public specification: BrandingBonusSpecOldDto;

  @ApiProperty({ type: RangeIntegerEntity, isArray: true })
  public calculation_periods: RangeItemsDto[];

  @ApiProperty({ type: Boolean })
  public is_auto_calculation: boolean;

  @ApiProperty({ type: Boolean })
  public is_auto_payment: boolean;

  @ApiPropertyOptional({ type: String })
  public driver_id?: string;
}
