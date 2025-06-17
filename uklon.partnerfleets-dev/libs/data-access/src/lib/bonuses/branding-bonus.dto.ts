import { RangeItemsDto } from '../common';
import { FleetDriverBasicInfoDto } from '../drivers/fleet-employee-name-by-id.dto';
import { VehicleBasicInfoDto } from '../vehicles/vehicle.dto';

import { BrandingBonusCalcSourceDto } from './branding-bonus-calc-source.dto';
import { BrandingBonusDto } from './branding-bonus-old.dto';
import { BrandingCalculationProgramParamsDto } from './branding-calculation-program-params.dto';

export interface BrandingBonusCalculationPeriodDto {
  calculation_id: string;
  period: RangeItemsDto;
  calculation_created_at: number;
  branding_types?: string[];
}

export interface BrandingCalculationsProgramDto {
  id: string;
  name?: string;
  status?: string;
  life_time: RangeItemsDto;
  calculation_periods: RangeItemsDto[];
  is_auto_calculation: boolean;
  parameters: BrandingCalculationProgramParamsDto;
  created_at: number;
  updated_at: number;
  updated_by: string;
}

export interface BonusBrandingProgramNameDto {
  id: string;
  name: string;
  status: string;
}

export interface BrandingBonusProgramCalculationDto {
  calculation_item_id: string;
  participant_id: string;
  fleet_id: string;
  vehicle_id: string;
  bonus_receiver_wallet_id: string;
  bonus: BrandingBonusDto;
  calculation_source: BrandingBonusCalcSourceDto;
  vehicle?: VehicleBasicInfoDto;
  driver?: FleetDriverBasicInfoDto;
}
