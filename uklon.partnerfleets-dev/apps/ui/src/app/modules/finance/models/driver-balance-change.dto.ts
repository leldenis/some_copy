import { EmployeeWalletItemDto } from '@data-access';

export interface DriverBalanceChangeDto {
  amount: number;
  driver: EmployeeWalletItemDto;
}
