import { MoneyDto } from '../finance/money.dto';
import { GroupedByEntrepreneurSplitPaymentDto, SplitPaymentDto } from '../finance/split-payment.dto';

import { StatisticLossDto } from './statistic-loss.dto';
import { StatisticProfitDto } from './statistic-profit.dto';

export interface StatisticDetailsDto {
  completed_orders: number;
  cancellation_percentage: number;
  loss: StatisticLossDto;
  profit: StatisticProfitDto;
  rating?: number;
  gross_income?: MoneyDto;
  earnings_for_period?: MoneyDto;
  total_distance_meters?: number;
  split_payments?: SplitPaymentDto[];
  grouped_splits?: GroupedByEntrepreneurSplitPaymentDto;
  total_executing_time?: number;
  average_price_per_kilometer?: MoneyDto;
}
