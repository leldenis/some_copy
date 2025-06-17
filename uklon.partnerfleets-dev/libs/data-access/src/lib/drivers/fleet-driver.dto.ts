import {
  BlockedListStatusValue,
  DriverStatus,
  DriverVehicleAccessType,
  Restriction,
  RestrictionReason,
  TicketStatus,
} from '@constant';

import { BlockedListStatusDto } from '../blocked-list';
import { OffsetQueryParamsDto } from '../common';

import { CashLimitType } from './driver-cash-limit.dto';
import { DriverKarmaDto } from './driver-karma.dto';
import { DriverPaymentInfoDto } from './driver-payment-details.dto';
import { DriverPhotoControlReasonsDto } from './driver-photo-control.dto';
import { DriverSelectedVehicleDto } from './driver-selected-vehicle.dto';

export interface FleetDriverDto {
  id: string;
  first_name: string;
  last_name: string;
  phone: string;
  license: string;
  signal: number;
  email: string;
  rating: number;
  karma: DriverKarmaDto;
  employed_from: number;
  selected_vehicle?: DriverSelectedVehicleDto;
  payment_details?: DriverPaymentInfoDto;
  restrictions?: EmployeeRestrictionDetailsDto[];
  access_type?: DriverVehicleAccessType;
  status: BlockedListStatusDto;
  photo_control?: DriverDetailsPhotoControlDto;
  delayed_restrictions?: EmployeeRestrictionDetailsDto[];
}

export interface EmployeeRestrictionItemDto {
  fleet_id: string;
  type: Restriction;
  actual_from?: number;
}

export interface EmployeeRestrictionDetailsDto {
  restricted_by: RestrictionReason;
  restriction_items: EmployeeRestrictionItemDto[];
}

export interface DriversQueryParamsDto extends OffsetQueryParamsDto {
  name?: string;
  phone?: string;
  status?: DriverStatus | '';
  block_status?: BlockedListStatusValue;
  has_restriction_by_cash_limit?: boolean;
  cash_limit_type?: CashLimitType | '';
}

export interface DriversByCashLimitQueryParamsDto {
  from: number;
  limit: number;
  cash_limit_type: CashLimitType;
}

export interface DriverDetailsPhotoControlDto extends DriverPhotoControlReasonsDto {
  ticket_id: string;
  deadline_to_send?: number;
  block_immediately?: boolean;
  status?: TicketStatus;
}
