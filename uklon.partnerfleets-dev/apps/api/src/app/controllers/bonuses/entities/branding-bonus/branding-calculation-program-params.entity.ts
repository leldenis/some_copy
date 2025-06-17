import {
  BrandingProgramParamsOrdersEntity,
  RangeIntegerEntity,
  RangeStringEntity,
} from '@api/controllers/bonuses/entities';
import { Day } from '@constant';
import { BrandingCalculationProgramParamsDto, BrandingProgramParamsOrdersDto, RangeItemsDto } from '@data-access';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { Currency } from '@uklon/types';

export class BrandingCalculationProgramParamsEntity implements BrandingCalculationProgramParamsDto {
  @ApiProperty({ type: Number, isArray: true })
  public regions: number[];

  @ApiProperty({ type: RangeIntegerEntity })
  public driver_rating: RangeItemsDto;

  @ApiProperty({ enum: Currency, enumName: 'Currency' })
  public currency: Currency;

  @ApiPropertyOptional({ type: String })
  public time_zone?: string;

  @ApiProperty({ type: BrandingProgramParamsOrdersEntity })
  public orders: BrandingProgramParamsOrdersDto;

  @ApiProperty({ type: RangeIntegerEntity })
  public distance: RangeItemsDto;

  @ApiProperty({ type: RangeStringEntity, isArray: true })
  public time: RangeItemsDto<string>[];

  @ApiProperty({ enum: Day, enumName: 'Day', isArray: true })
  public days: Day[];

  @ApiPropertyOptional({ type: String, isArray: true })
  public order_acceptance_methods?: string[];

  @ApiPropertyOptional({ type: String, isArray: true })
  public product_types?: string[];

  @ApiPropertyOptional({ type: String, isArray: true })
  public fleet_types?: string[];

  @ApiPropertyOptional({ type: String, isArray: true })
  public fleet_withdrawal_types?: string[];

  @ApiPropertyOptional({ type: String, isArray: true })
  public branding_types?: string[];
}
