import { FleetCourierProductEntity } from '@api/common/entities/products/fleet-courier-product.entity';
import { ProductConfigurationEntity } from '@api/common/entities/products/product-configuration.entity';
import { CourierProductDto, FleetCourierProductDto } from '@data-access';
import { ApiProperty } from '@nestjs/swagger';

export class CourierProductEntity extends ProductConfigurationEntity implements CourierProductDto {
  @ApiProperty({ type: FleetCourierProductEntity })
  public product: FleetCourierProductDto;
}
