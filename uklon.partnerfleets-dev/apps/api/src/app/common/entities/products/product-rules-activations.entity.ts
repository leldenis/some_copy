import { ProductRulesActivationsDto } from '@data-access';
import { ApiProperty } from '@nestjs/swagger';

export class ProductRulesActivationsEntity implements ProductRulesActivationsDto {
  @ApiProperty({ type: Boolean })
  public driver_fleet_type_enabled: boolean;

  @ApiProperty({ type: Boolean })
  public max_allowed_cancel_percent_enabled: boolean;

  @ApiProperty({ type: Boolean })
  public min_completed_order_count_enabled: boolean;

  @ApiProperty({ type: Boolean })
  public min_rating_enabled: boolean;

  @ApiProperty({ type: Boolean })
  public min_work_time_days_enabled: boolean;
}
