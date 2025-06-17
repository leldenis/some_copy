import { CashLimitType } from '../drivers/driver-cash-limit.dto';

import { MoneyDto } from './money.dto';

export enum CashLimitsSettingsPeriod {
  DAY = 'Day',
  WEEK = 'Week',
}

export interface CashLimitsSettingsDto {
  period: CashLimitsSettingsPeriod;
  enabled: boolean;
  limit: MoneyDto;
}

export interface CashLimitsSettingsUpdateDto {
  period: CashLimitsSettingsPeriod;
  amount: number; // cents
  enabled: boolean;
}

export interface CashLimitsDriversSettingsUpdateDto {
  amount: number;
  enabled: boolean;
  driver_ids: string[];
  type?: CashLimitType;
}
