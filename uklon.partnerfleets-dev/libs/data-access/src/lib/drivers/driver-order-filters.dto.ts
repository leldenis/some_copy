import { Currency } from '@uklon/types';

import { FeeType } from '../gateways';
import { SectorTagDto } from '../sectors';

export enum DriverOrderFilterTypeVersion {
  V1 = 'V1',
  V2 = 'V2',
}

export enum LocalityType {
  CITY = 'city',
  SUBURBAN = 'suburban',
  INTERCITY = 'intercity',
}

export interface DriverOrderFiltersCollectionDto {
  order_filters: DriverOrderFilterDto[];
}

export interface DriverOrderFilterDto {
  filter_id: string;
  name: string;
  offer_enabled_at: number;
  for_offer: boolean;
  broadcast_enabled_at: number;
  for_broadcast: boolean;
  loop_enabled_at: number;
  for_loop: boolean;
  filters: DriverOrderFiltersDto;
  type_version?: DriverOrderFilterTypeVersion;
}

export interface DriverOrderFiltersDto {
  distance: DriverOrderFilterDistanceDto;
  payment: DriverOrderFilterPaymentDto;
  include_source_sectors?: DriverOrderFilterSectorsDto;
  include_destination_sectors?: DriverOrderFilterSectorsDto;
  exclude_source_sectors?: DriverOrderFilterSectorsDto;
  exclude_destination_sectors?: DriverOrderFilterSectorsDto;
  pickup_time: DriverOrderFilterPickupTimeDto;
  tariff?: DriverOrderFilterTariffDto;
  cost?: DriverOrderFilterCostDto;
  locality?: DriverOrderFilterLocalityDto;
}

export interface DriverOrderFilterDistanceDto {
  max_distance_km: number;
  is_enabled: boolean;
}

export interface DriverOrderFilterTariffDistanceDto {
  distance_km: number;
  is_enabled: boolean;
}

export interface DriverOrderFilterPaymentDto {
  payment_types: FeeType[];
  is_enabled: boolean;
}

export interface DriverOrderFilterSectorsDto {
  sector_ids?: string[];
  is_enabled: boolean;
  sectors_tags?: SectorTagDto[][];
}

export interface DriverOrderFilterPickupTimeDto {
  order_pickup_time_type: string;
  is_enabled: boolean;
}

export interface DriverOrderFilterTariffDto {
  minimal_tariff_cost?: DriverOrderFilterTariffCostDto;
  min_cost_per_km?: DriverOrderFilterTariffCostDto;
  min_cost_per_suburban_km?: DriverOrderFilterTariffCostDto;
  minimal_tariff_distance?: DriverOrderFilterTariffDistanceDto;
  is_enabled: boolean;
}

export interface DriverOrderFilterCostDto {
  minimal?: DriverOrderFilterCostValueDto;
  minimal_per_km?: DriverOrderFilterCostValueDto;
}

export interface DriverOrderFilterTariffCostDto {
  cost: number;
  currency_code: Currency;
  is_enabled: boolean;
}

export interface DriverOrderFilterCostValueDto {
  value: number;
  currency_code: Currency;
  is_enabled: boolean;
}

export interface DriverOrderFilterLocalityDto {
  type: LocalityType[];
  is_enabled: boolean;
}
