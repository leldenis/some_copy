import { MoneyDto } from './money.dto';

export interface WalletTransferItemDto {
  employee_id: string;
  amount: MoneyDto;
}
