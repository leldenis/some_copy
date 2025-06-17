import { MoneyDto } from '../finance/money.dto';

import { StatisticOrderProfitDto } from './statistic-order-profit.dto';

export interface StatisticProfitDto {
  total?: MoneyDto;
  order?: StatisticOrderProfitDto;
  tips?: MoneyDto;
  bonus?: MoneyDto;
  promotion?: MoneyDto;
  fine?: MoneyDto;
  merchant?: MoneyDto;
  compensation?: MoneyDto;
  commission_programs_profit?: MoneyDto;
}
