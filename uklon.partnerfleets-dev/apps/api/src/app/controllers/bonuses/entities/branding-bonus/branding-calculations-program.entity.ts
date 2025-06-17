import { BrandingCalculationProgramParamsEntity } from '@api/controllers/bonuses/entities';
import { RangeIntegerEntity } from '@api/controllers/bonuses/entities/branding-bonus/branding-bonus-spec-old.entity';
import { BrandingCalculationProgramParamsDto, BrandingCalculationsProgramDto, RangeItemsDto } from '@data-access';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class BrandingCalculationsProgramEntity implements BrandingCalculationsProgramDto {
  @ApiProperty({ type: String })
  public id: string;

  @ApiPropertyOptional({ type: String })
  public name?: string;

  @ApiPropertyOptional({ type: String })
  public status?: string;

  @ApiProperty({ type: RangeIntegerEntity })
  public life_time: RangeItemsDto;

  @ApiProperty({ type: RangeIntegerEntity, isArray: true })
  public calculation_periods: RangeItemsDto[];

  @ApiProperty({ type: Boolean })
  public is_auto_calculation: boolean;

  @ApiProperty({ type: BrandingCalculationProgramParamsEntity })
  public parameters: BrandingCalculationProgramParamsDto;

  @ApiProperty({ type: Number })
  public created_at: number;

  @ApiProperty({ type: Number })
  public updated_at: number;

  @ApiProperty({ type: String })
  public updated_by: string;
}
