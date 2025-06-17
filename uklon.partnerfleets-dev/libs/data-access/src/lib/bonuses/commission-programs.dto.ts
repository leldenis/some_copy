import { DateRangeDto } from '../common';
import { FleetWithArchivedDriversBasicInfoDto } from '../drivers/fleet-employee-name-by-id.dto';
import { InfinityScrollCollectionDto } from '../pagination/ininity-scroll-collection.dto';
import { VehicleBasicInfoDto } from '../vehicles/vehicle.dto';

export interface CommissionRateDto {
  order_completed_count_range: DateRangeDto;
  value: number;
}

export interface CommissionProgramsDto {
  program_id: string;
  participant_id: string;
  fleet_id?: string;
  vehicle_id?: string;
  driver_id?: string;
  wallet_id?: string;
  program_name: string;
  min_rating: number;
  current_completed_orders: number;
  period: DateRangeDto;
  commissions: CommissionRateDto[];
  order_acceptance_methods?: string[];
  product_types?: string[];
  region_ids?: number[];
  is_profit_budget: boolean;
  profit_budget?: number;
  used_profit_budget?: number;
  always_add_progress_if_satisfied: boolean;
  participant_type: string;
  vehicle?: VehicleBasicInfoDto;
  driver?: FleetWithArchivedDriversBasicInfoDto;
}

export type CommissionProgramsCollectionDto = InfinityScrollCollectionDto<CommissionProgramsDto>;

export interface DriverCommissionProgramsFiltersDto {
  driver_id?: string;
}

export interface VehicleCommissionProgramsFiltersDto {
  vehicle_id?: string;
}
