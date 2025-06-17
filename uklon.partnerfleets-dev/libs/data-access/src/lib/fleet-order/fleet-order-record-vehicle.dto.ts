import { GatewayOrderProductConditionDto } from '../gateways';
import { PhotosDto } from '../photos.dto';

export interface FleetOrderRecordVehicleDto {
  id: string;
  licencePlate: string;
  productType: string;
  productConditions?: GatewayOrderProductConditionDto[];
  photos?: PhotosDto;
}
