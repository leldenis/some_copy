import { FleetProductDto } from '../products/fleet-product.dto';
import { ProductConfigurationsDto } from '../products/product-configurations.dto';

export interface DriverProductConfigurationsDto extends ProductConfigurationsDto {
  product: FleetProductDto;
}
