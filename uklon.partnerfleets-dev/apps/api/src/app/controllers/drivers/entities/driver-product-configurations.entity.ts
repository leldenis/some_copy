import { FleetProductEntity } from '@api/common/entities/products/fleet-product.entity';
import { ProductConfigurationEntity } from '@api/common/entities/products/product-configuration.entity';
import { DriverProductConfigurationsDto, FleetProductDto } from '@data-access';
import { ApiProperty } from '@nestjs/swagger';

export class DriverProductConfigurationsEntity
  extends ProductConfigurationEntity
  implements DriverProductConfigurationsDto
{
  @ApiProperty({ type: FleetProductEntity })
  public product: FleetProductDto;
}
