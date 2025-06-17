import {
  CourierActivityCalcByOrdersDto,
  CourierActivityRateDetailsDto,
  CourierActivityRateDto,
  CourierActivitySettingsDto,
} from '@data-access';
import { ApiProperty } from '@nestjs/swagger';

export class CourierActivityRateEntity implements CourierActivityRateDto {
  @ApiProperty({ type: Number })
  public value: number;
}

export class CourierActivityRateCalcByOrdersEntity implements CourierActivityCalcByOrdersDto {
  @ApiProperty({ type: Number })
  public completed_count: number;

  @ApiProperty({ type: Number })
  public rejected_count: number;

  @ApiProperty({ type: Number })
  public canceled_count: number;
}

export class CourierActivityRateDetailsEntity
  extends CourierActivityRateEntity
  implements CourierActivityRateDetailsDto
{
  @ApiProperty({ type: CourierActivityRateCalcByOrdersEntity })
  public calculated_by_orders: CourierActivityCalcByOrdersDto;
}

export class CourierActivitySettingsEntity implements CourierActivitySettingsDto {
  @ApiProperty({ type: Boolean })
  public is_active: boolean;

  @ApiProperty({ type: Number })
  public activated_at: number;
}
