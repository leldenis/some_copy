import { AdvancedOptions, BodyType, LoadCapacity } from '@constant';

export interface VehicleTicketCreationDto {
  tiket_id: string;
  license_plate?: string;
  body_type?: BodyType;
  options?: AdvancedOptions[];
  load_capacity?: LoadCapacity;
  has_taxi_license?: boolean;
}
