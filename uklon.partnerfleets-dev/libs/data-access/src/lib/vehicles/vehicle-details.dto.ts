import { BodyType, FleetVehicleComfortLevel, LoadCapacity } from '@constant';

import { BlockedListStatusDto } from '../blocked-list';
import { VehicleDetailsPhotoControlDto } from '../fleet-vehicle';

import { SelectedByDriverDto } from './selected-by-driver.dto';
import { VehicleBrandingPeriodDto } from './vehicle-branding-period.dto';

export interface VehicleDetailsDto {
  id?: string;
  vin_code?: string;
  color?: string;
  body_type?: BodyType;
  license_plate?: string;
  make?: string;
  make_id?: string;
  model?: string;
  model_id?: string;
  production_year?: number;
  added_to_fleet?: number;
  options?: string[];
  comfort_level?: FleetVehicleComfortLevel;
  selected_by_driver?: SelectedByDriverDto;
  passenger_seats_count?: number;
  load_capacity?: LoadCapacity;
  photo_control?: VehicleDetailsPhotoControlDto;
  status: BlockedListStatusDto;
  branding_period?: VehicleBrandingPeriodDto;
}
