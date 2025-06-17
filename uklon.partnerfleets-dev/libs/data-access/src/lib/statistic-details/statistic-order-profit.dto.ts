import { MoneyDto } from '../finance/money.dto';

export interface StatisticOrderProfitDto {
  total?: MoneyDto;
  cash?: MoneyDto;
  card?: MoneyDto;
  wallet?: MoneyDto;
  merchant?: MoneyDto;
}
