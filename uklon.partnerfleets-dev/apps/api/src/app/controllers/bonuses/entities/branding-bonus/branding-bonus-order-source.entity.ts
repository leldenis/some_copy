import { BrandingBonusOrderSourceDto } from '@data-access';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class BrandingBonusOrderSourceEntity implements BrandingBonusOrderSourceDto {
  @ApiProperty({ type: Number })
  public completed: number;

  @ApiPropertyOptional({ type: Number })
  public cancelled?: number;

  @ApiPropertyOptional({ type: Number })
  public total?: number;

  @ApiPropertyOptional({ type: Number })
  public cancellation_percentage?: number;

  @ApiPropertyOptional({ type: Number })
  public completed_amount?: number;
}
