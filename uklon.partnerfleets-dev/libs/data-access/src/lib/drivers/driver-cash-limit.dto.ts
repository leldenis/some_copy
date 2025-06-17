import { MoneyDto } from '../finance/money.dto';

export enum CashLimitType {
  FLEET = 'Fleet',
  INDIVIDUAL = 'Individual',
  NO_LIMITS = 'NoLimits',
}

export interface DriverCashLimitDto {
  limit: MoneyDto;
  used_amount: MoneyDto;
  type: CashLimitType;
}
