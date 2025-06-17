import { KarmaSettingsDto } from './karma-settings.dto';

export interface RegionDto {
  id: number;
  code: string;
  country_code: string;
  currency?: string;
  karma_settings?: KarmaSettingsDto;
}

export interface CountryDto {
  country: string;
}
