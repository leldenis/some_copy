import { FleetDriverDto } from '../drivers/fleet-driver.dto';
import { MoneyDto } from '../finance/money.dto';

export interface DashboardStatisticsTopDriverDto {
  driver: FleetDriverDto;
  total_income: MoneyDto;
  total_orders_count: number;
  cancel_percent: number;
  karma: number;
  karma_group: string;
  rating: number;
}

export interface DashboardStatisticsHistogramItemDto {
  date: number;
  total_bonus: MoneyDto;
  total_compensations: MoneyDto;
  total_penalties: MoneyDto;
  total_cash_earnings: MoneyDto;
  total_cashless_earnings: MoneyDto;
  total_tips: MoneyDto;
  total_fee: MoneyDto;
}

export interface DashboardStatisticsProductItemDto {
  product_code: string;
  earnings: MoneyDto;
  percent: number;
}

export interface DashboardStatisticsDto {
  gross_income: MoneyDto;
  fee_amount: MoneyDto;
  profit_amount: MoneyDto;
  total_orders_count: number;
  total_distance_meters: number;
  average_order_cost: MoneyDto;
  average_price_per_kilometer: MoneyDto;
  gross_amount_cash: MoneyDto;
  gross_amount_cashless: MoneyDto;
  bonuses_amount: MoneyDto;
  top_drivers: DashboardStatisticsTopDriverDto[];
  histogram_items: DashboardStatisticsHistogramItemDto[];
  product_items: DashboardStatisticsProductItemDto[];
}
