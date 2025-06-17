import { MoneyDto } from '../finance/money.dto';

import { StatisticOrderLossDto } from './statistic-order-loss.dto';

export interface StatisticLossDto {
  total?: MoneyDto;
  order?: StatisticOrderLossDto;
}
