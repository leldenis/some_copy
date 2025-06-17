import { FleetCourierProductDto } from '../products/fleet-product.dto';
import { ProductConfigurationsDto } from '../products/product-configurations.dto';

export interface CourierProductDto extends ProductConfigurationsDto {
  product: FleetCourierProductDto;
}

export interface CourierProductCollectionDto {
  items: CourierProductDto[];
}
