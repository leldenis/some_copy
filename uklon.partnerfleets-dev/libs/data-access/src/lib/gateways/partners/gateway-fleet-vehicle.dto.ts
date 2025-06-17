import { BodyType, LoadCapacity } from '@constant';

import { BlockedListStatusDto } from '../../blocked-list';
import { VehicleDetailsPhotoControlDto } from '../../fleet-vehicle';
import { VehicleBrandingPeriodDto } from '../../vehicles/vehicle-branding-period.dto';

import { GatewayFleetVehicleDriverDto } from './gateway-fleet-vehicle-driver.dto';

export interface GatewayFleetVehicleDto {
  access_to_drivers_type: string;
  added_to_fleet: number;
  color: string;
  comfort_level: string;
  fuels: string[];
  has_dispatching_priority: boolean;
  id: string;
  is_branded: boolean;
  license_plate: string;
  make: string;
  make_id: string;
  model: string;
  model_id: string;
  options: string[];
  passenger_seats_count: number;
  production_year: number;
  selected_by_driver: GatewayFleetVehicleDriverDto;
  body_type: BodyType;
  load_capacity?: LoadCapacity;
  status: BlockedListStatusDto;
  photo_control: VehicleDetailsPhotoControlDto;
  branding_period: VehicleBrandingPeriodDto;
}
