import { DriverFleetType } from '@constant';
import { ProductAccessibilityRulesDto } from '@data-access';
import { ApiProperty } from '@nestjs/swagger';

export class ProductAccessibilityRulesEntity implements ProductAccessibilityRulesDto {
  @ApiProperty({ enum: DriverFleetType, enumName: 'DriverFleetType' })
  public driver_fleet_type: DriverFleetType;

  @ApiProperty({ type: Number })
  public max_allowed_cancel_percent: number;

  @ApiProperty({ type: Number })
  public min_completed_order_count: number;

  @ApiProperty({ type: Number })
  public min_rating: number;

  @ApiProperty({ type: Number })
  public min_work_time_days: number;
}
