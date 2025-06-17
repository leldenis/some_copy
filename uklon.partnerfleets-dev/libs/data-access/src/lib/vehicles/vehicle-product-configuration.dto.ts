import { FleetProductDto } from '../products/fleet-product.dto';

export interface VehicleProductConfigurationDto {
  product: FleetProductDto;
  is_available: boolean;
  is_editable: boolean;
}
