import { ProductAvailabilityDto } from '@data-access';
import { ApiProperty } from '@nestjs/swagger';

export class ProductAvailabilityEntity implements ProductAvailabilityDto {
  @ApiProperty({ type: Boolean })
  public is_available: boolean;

  @ApiProperty({ type: Boolean })
  public is_restricted_by_accessibility_rules: boolean;

  @ApiProperty({ type: Boolean })
  public is_blocked: boolean;

  @ApiProperty({ type: Boolean })
  public is_restricted_by_selected_vehicle: boolean;

  @ApiProperty({ type: Boolean })
  public is_restricted_by_vehicle_params: boolean;
}
