import { AdvancedOptions, BodyType, LoadCapacity } from '@constant';

export interface VehicleTicketUpdateDto {
  license_plate?: string;
  body_type?: BodyType;
  options?: AdvancedOptions[];
  load_capacity?: LoadCapacity;
  has_taxi_license?: boolean;
}
