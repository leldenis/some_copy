import { EmployeeWalletItemDto } from './employee-wallet-item.dto';
import { MoneyDto } from './money.dto';

export interface DriverWalletsDto {
  total_drivers_balance: MoneyDto;
  items: EmployeeWalletItemDto[];
}
