import { VehicleDetailsPhotoControlDto } from '../fleet-vehicle';
import { PhotosDto } from '../photos.dto';
import { PictureUrlDto } from '../picture-url-dto.interface';

/* eslint-disable @typescript-eslint/naming-convention */
export enum EmployeeLocationStatus {
  OrderExecution = 'OrderExecution',
  Active = 'Active',
  Inactive = 'Inactive',
  Blocked = 'Blocked',
}

export enum DriverFilter {
  OFFER = 'Offer',
  BROADCAST = 'Broadcast',
  FAST_SEARCH = 'FastSearch',
  CHAIN = 'Chain',
  HOME_FILTER = 'HomeFilter',
  LOOP_FILTER = 'OfferLoopFilter',
}

export interface DriversLiveMapDataDto {
  drivers: LiveMapEmployeeDto[];
  actual_on: number;
  cache_time_to_live: number;
}

export interface CouriersLiveMapDataDto {
  couriers: LiveMapEmployeeDto[];
  actual_on: number;
  cache_time_to_live: number;
}

export interface LiveMapDataDto<T = LiveMapEmployeeDto> {
  data: T[];
  actual_on: number;
  cache_time_to_live: number;
}

export interface LiveMapEmployeeDto {
  id: string;
  phone: string;
  last_name: string;
  first_name: string;
  status: EmployeeLocationStatus;
  active_orders: LiveMapActiveOrderDto[];
  location: LiveMapLocationDto;
  order_accepting_methods?: DriverFilter[];
  vehicle?: LiveMapVehicleDto;
  photos: PhotosDto;
  is_device_online: boolean;
  is_driver_in_idle: boolean;
}

export interface LiveMapActiveOrderDto {
  id: string;
  status: string;
}

export interface LiveMapLocationDto {
  latitude: number;
  longitude: number;
}

export interface LiveMapVehicleDto {
  id: string;
  license_plate: string;
  make: string;
  model: string;
  comfort_level: string;
  photos: {
    driver_car_front_photo: PictureUrlDto;
    vehicle_angled_front: PictureUrlDto;
  };
  photo_control?: VehicleDetailsPhotoControlDto;
}

export interface LiveMapFiltersDto {
  name: string;
  licensePlate?: string;
}
