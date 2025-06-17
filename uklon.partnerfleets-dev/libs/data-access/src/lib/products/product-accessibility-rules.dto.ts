import { DriverFleetType } from '@constant';

export interface ProductAccessibilityRulesDto {
  driver_fleet_type: DriverFleetType;
  max_allowed_cancel_percent: number;
  min_completed_order_count: number;
  min_rating: number;
  min_work_time_days: number;
}
