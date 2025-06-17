import { DriverFleetType } from '@constant';
import { DriverAccessibilityRulesMetricsDto } from '@data-access';
import { ApiProperty } from '@nestjs/swagger';

export class DriverAccessibilityRulesMetricsEntity implements DriverAccessibilityRulesMetricsDto {
  @ApiProperty({ type: Number })
  public cancel_rate: number;

  @ApiProperty({ type: Number })
  public completed_orders_count: number;

  @ApiProperty({ enum: DriverFleetType, enumName: 'DriverFleetType' })
  public fleet_type: DriverFleetType;

  @ApiProperty({ type: Number })
  public rating: number;

  @ApiProperty({ type: Number })
  public working_days: number;
}
