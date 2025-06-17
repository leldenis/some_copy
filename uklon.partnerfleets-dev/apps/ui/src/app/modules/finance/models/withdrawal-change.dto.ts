import { BalanceChangeDto } from './balance-change.dto';

export interface WithdrawalChangeDto {
  total: number;
  toFleet: BalanceChangeDto;
  toDrivers: BalanceChangeDto;
}
