import { DriverVehicleAccessType, VehicleAccessType } from '@constant';

import { Driver } from '../drivers/fleet-drivers-item.dto';
import { FleetVehicleDto } from '../fleet-vehicle';

export interface VehicleAccessSettingsDto {
  access_type: VehicleAccessType;
  drivers: Driver[];
  comment?: string;
}

export interface VehicleAccessSettingUpdateItemDto {
  type: 'Access';
  driver_ids: string[];
}

export interface DriverVehicleAccessSettingsDto {
  access_type: DriverVehicleAccessType;
  vehicles: FleetVehicleDto[];
  comment?: string;
}

export interface DriverVehicleAccessSettingUpdateItemDto {
  type: 'Access';
  vehicle_ids: string[];
}
