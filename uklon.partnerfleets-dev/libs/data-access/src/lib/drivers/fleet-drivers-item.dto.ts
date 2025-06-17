import { DriverStatus } from '@constant';

import { BlockedListStatusDto } from '../blocked-list';
import { DriverFilter } from '../live-map';
import { PaginationCollectionDto } from '../pagination/pagination-collection.dto';

import { DriverBaseKarmaDto } from './driver-base-karma.dto';
import { DriverCashLimitDto } from './driver-cash-limit.dto';
import { DriverVehicleDto } from './driver-vehicle.dto';
import { DriverDetailsPhotoControlDto, EmployeeRestrictionDetailsDto } from './fleet-driver.dto';

export interface FleetDriversItemDto {
  id: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  signal?: number;
  rating?: number;
  karma?: DriverBaseKarmaDto;
  status?: DriverStatus | BlockedListStatusDto;
  selected_vehicle?: DriverVehicleDto;
  block_status?: BlockedListStatusDto;
  is_online?: boolean;
  photo_control?: DriverDetailsPhotoControlDto;
  cash_limit?: DriverCashLimitDto;
  restrictions?: EmployeeRestrictionDetailsDto[];
  active_driver_filters?: DriverFilter[];
}

export type Driver = FleetDriversItemDto;
export type FleetDriversCollection = PaginationCollectionDto<FleetDriversItemDto>;
