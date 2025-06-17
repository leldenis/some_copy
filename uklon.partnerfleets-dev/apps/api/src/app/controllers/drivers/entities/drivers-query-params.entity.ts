import { BlockedListStatusValue, DriverStatus } from '@constant';
import { CashLimitType, DriversQueryParamsDto } from '@data-access';

export class DriversQueryParamsEntity implements DriversQueryParamsDto {
  public name: string;
  public phone: string;
  public status: DriverStatus;
  public offset: number;
  public limit: number;
  public block_status: BlockedListStatusValue;
  public region_id: number;
  public has_restriction_by_cash_limit: boolean;
  public cash_limit_type: CashLimitType | '';
}
