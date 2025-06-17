import { CollectionDto } from '../common';

import { SelectedByDriverDto } from './selected-by-driver.dto';

export interface VehicleDto {
  id: string;
  license_plate: string;
  make: string;
  make_id: string;
  model: string;
  model_id: string;
  production_year: number;
  selected_by_driver?: SelectedByDriverDto;
  comfort_level: string;
  color: string;
  added_to_fleet: number;
  passenger_seats_count?: number;
}

export interface VehicleBasicInfoDto {
  vehicle_id: string;
  license_plate: string;
  color: string;
  comfort_level: string;
  has_dispatching_priority: boolean;
  is_branded: boolean;
  make: string;
  model: string;
  production_year: number;
  selected_by_driver_id?: string;
}

export type VehicleBasicInfoCollection = CollectionDto<VehicleBasicInfoDto>;
