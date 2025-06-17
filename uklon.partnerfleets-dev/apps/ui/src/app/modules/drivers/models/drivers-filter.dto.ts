import { BlockedListStatusValue, DriverStatus } from '@constant';
import { CashLimitType } from '@data-access';

export interface DriversFilterDto {
  name: string;
  phone: string;
  status?: DriverStatus;
  block_status?: BlockedListStatusValue;
  has_restriction_by_cash_limit?: boolean;
  cash_limit_type?: CashLimitType | '';
}
