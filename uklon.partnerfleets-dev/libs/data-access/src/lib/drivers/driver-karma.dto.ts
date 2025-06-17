import { KarmaGroup } from '@constant';

import { KarmaCalculationMetricsDto } from './karma-calculation-metrics.dto';

export interface DriverKarmaDto {
  calculation_metrics: KarmaCalculationMetricsDto;
  orders_to_calculation: number;
  reset_count: number;
  group: KarmaGroup;
  value: number;
}
