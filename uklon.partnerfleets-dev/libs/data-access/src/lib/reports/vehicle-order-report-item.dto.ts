import { CollectionCursorDto } from '../collection-cursor.dto';
import { DateRangeDto } from '../common';
import { MoneyDto } from '../finance/money.dto';

export interface VehicleOrderReportItemDto {
  vehicle_id: string;
  license_plate: string;
  make: string;
  model: string;
  color: string;
  production_year: number;
  is_branded: boolean;
  branded_days: number;
  dispatching_priority_days: number;
  has_dispatching_priority: boolean;
  total_orders_count: number;
  total_distance_meters: number;
  gross_income: MoneyDto;
  profit_amount: MoneyDto;
  fee_amount: MoneyDto;
  total_cash_earnings: MoneyDto;
  total_cashless_earnings: MoneyDto;
  average_order_cost: MoneyDto;
  total_bonus: MoneyDto;
  total_compensations: MoneyDto;
  total_tips: MoneyDto;
  total_penalties: MoneyDto;
  average_cashless_order_cost: MoneyDto;
  average_cash_order_cost: MoneyDto;
  average_price_per_kilometer: MoneyDto;
  online_time_seconds: number;
  orders_execution_time_seconds: number;
  orders_per_hour: number;
}

export type VehicleOrderReportCollectionDto = CollectionCursorDto<VehicleOrderReportItemDto>;

export interface VehicleOrderReportsFiltersDto {
  period: DateRangeDto;
  vehicle_id: string;
}
