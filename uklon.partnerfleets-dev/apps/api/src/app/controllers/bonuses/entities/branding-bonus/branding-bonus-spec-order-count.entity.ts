import { BrandingBonusSpecOrderCountDto } from '@data-access';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class BrandingSpecOrderCountEntity implements BrandingBonusSpecOrderCountDto {
  @ApiProperty({ type: Number, isArray: true })
  public range: number[];

  @ApiPropertyOptional({ type: Number })
  public value?: number;
}
