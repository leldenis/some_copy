import { MoneyDto } from '../finance/money.dto';

export interface StatisticOrderLossDto {
  total?: MoneyDto;
  wallet?: MoneyDto;
}
