import { DriverFleetType } from '@constant';

export interface DriverAccessibilityRulesMetricsDto {
  cancel_rate: number;
  completed_orders_count: number;
  rating: number;
  working_days: number;
  fleet_type: DriverFleetType;
}
