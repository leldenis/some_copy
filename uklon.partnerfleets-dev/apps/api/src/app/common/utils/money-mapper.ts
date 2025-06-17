import { MoneyDto } from '@data-access';

import { Currency } from '@uklon/types';

export function amountToMoney(amount: number, currency: string = Currency.UAH): MoneyDto {
  return { amount: amount ? amount * 100 : 0, currency: currency as Currency };
}
