import { Currency } from '@uklon/types';

export interface MoneyDto {
  amount: number;
  currency: Currency;
  tax_id_number?: string;
}
