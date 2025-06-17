import { FleetOrderRecordVehicleDto } from './fleet-order-record-vehicle.dto';

export interface OrderRecordVehicleDto extends FleetOrderRecordVehicleDto {
  make: string;
  year: string;
  model: string;
}
