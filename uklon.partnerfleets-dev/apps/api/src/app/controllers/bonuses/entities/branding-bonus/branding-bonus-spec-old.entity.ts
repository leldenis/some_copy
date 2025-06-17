import { BrandingProgramParamsOrdersEntity } from '@api/controllers/bonuses/entities/branding-bonus/branding-program-params-orders.entity';
import { Day } from '@constant';
import { BrandingBonusSpecOldDto, BrandingProgramParamsOrdersDto, RangeItemsDto } from '@data-access';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { Currency } from '@uklon/types';

export class RangeIntegerEntity implements RangeItemsDto {
  @ApiProperty({ type: Number, isArray: true })
  public range: number[];
}

export class RangeStringEntity implements RangeItemsDto<string> {
  @ApiProperty({ type: String, isArray: true })
  public range: string[];
}

export class BrandingBonusSpecOldEntity implements BrandingBonusSpecOldDto {
  @ApiProperty({ type: Number })
  public region: number;

  @ApiProperty({ type: RangeIntegerEntity })
  public rating: {
    last: RangeItemsDto[];
  };

  @ApiProperty({ type: BrandingProgramParamsOrdersEntity })
  public orders: BrandingProgramParamsOrdersDto;

  @ApiProperty({ type: RangeStringEntity, isArray: true })
  public time: RangeItemsDto<string>[];

  @ApiProperty({ enum: Day, enumName: 'Day', isArray: true })
  public days: Day[];

  @ApiProperty({ enum: Currency, enumName: 'Currency' })
  public currency: Currency;

  @ApiProperty({ type: RangeIntegerEntity })
  public distance: RangeItemsDto;

  @ApiPropertyOptional({ type: String, isArray: true })
  public order_acceptance_methods?: string[];

  @ApiPropertyOptional({ type: String, isArray: true })
  public product_types?: string[];

  @ApiPropertyOptional({ type: String })
  public time_zone?: string;
}
