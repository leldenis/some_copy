import { DriverBalanceChangeDto } from './driver-balance-change.dto';

export interface BalanceChangeDto {
  total: number;
  maxAmount?: number;
  changes: DriverBalanceChangeDto[];
}
