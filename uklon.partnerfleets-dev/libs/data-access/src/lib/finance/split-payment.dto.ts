import { MoneyDto } from './money.dto';
import { FleetMerchant } from './wallet.dto';

export interface SplitPaymentDto {
  split_payment_id?: string;
  payment_provider: FleetMerchant;
  merchant_id: string;
  total: MoneyDto;
  fee: MoneyDto;
}

export type GroupedByEntrepreneurSplitPaymentDto = Record<string, SplitPaymentDto[]>;
