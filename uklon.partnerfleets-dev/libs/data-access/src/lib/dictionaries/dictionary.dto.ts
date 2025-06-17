import { Currency } from '@uklon/types';

import { Language } from '../account/language';
import { FleetVehicleOption } from '../fleet-vehicle';

export interface DictionaryDto {
  id?: number;
  code: string;
  currency?: Currency;
}

export interface RegionDictionaryItemDto {
  id: number;
  code: string;
  country_code: string;
  currency: Currency;
  locale_settings: RegionLocaleSettingsDto;
}

export interface RegionLocaleSettingsDto {
  allowed: Language[];
  default: Language;
}

export interface VehicleOptionDictionaryItemDto {
  code: FleetVehicleOption;
  is_driver_editable: boolean;
}
