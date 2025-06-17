import { FleetProductEntity } from '@api/common/entities/products/fleet-product.entity';
import { FleetProductDto, VehicleProductConfigurationDto } from '@data-access';
import { ApiProperty } from '@nestjs/swagger';

export class VehicleProductConfigurationEntity implements VehicleProductConfigurationDto {
  @ApiProperty({ type: FleetProductEntity })
  public product: FleetProductDto;

  @ApiProperty({ type: Boolean })
  public is_available: boolean;

  @ApiProperty({ type: Boolean })
  public is_editable: boolean;
}
