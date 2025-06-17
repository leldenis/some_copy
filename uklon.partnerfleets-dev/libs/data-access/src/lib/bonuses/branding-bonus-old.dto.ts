import { RangeItemsDto } from '../common';
import { FleetDriverBasicInfoDto } from '../drivers/fleet-employee-name-by-id.dto';
import { InfinityScrollCollectionDto } from '../pagination/ininity-scroll-collection.dto';
import { VehicleBasicInfoDto } from '../vehicles/vehicle.dto';

import { BrandingBonusCalcSourceDto, BrandingBonusSpecOldDto } from './index';

export interface BrandingBonusDto {
  value: number;
}

export interface BrandingTypeOldDto {
  types: string[];
  calculation_id: string;
}

export interface BrandingBonusCalculationPeriodOldDto {
  calculation_id: string;
  period: RangeItemsDto;
  calculation_created_at: number;
  branding_types?: string[];
  brandingTypes: BrandingTypeOldDto[];
}

export type BrandingBonusCalculationPeriodsCollectionOld =
  InfinityScrollCollectionDto<BrandingBonusCalculationPeriodOldDto>;

export interface BrandingBonusCalculationsProgramOldDto {
  id: string;
  name: string;
  life_time: RangeItemsDto;
  status: string;
  type: string;
  specification: BrandingBonusSpecOldDto;
  calculation_periods: RangeItemsDto[];
  is_auto_calculation: boolean;
  is_auto_payment: boolean;
  driver_id?: string;
}

export interface BrandingBonusProgramsOldDto {
  id: string;
  driver_id: string;
  vehicle_id?: string;
  wallet_id: string;
  calculation_source: BrandingBonusCalcSourceDto;
  bonus: BrandingBonusDto;
  vehicle?: VehicleBasicInfoDto;
  driver?: FleetDriverBasicInfoDto;
}

export type BrandingBonusProgramsCollectionOld = InfinityScrollCollectionDto<BrandingBonusProgramsOldDto>;
