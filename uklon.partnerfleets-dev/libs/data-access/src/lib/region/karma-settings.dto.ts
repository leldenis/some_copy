import { DateRangeDto } from '../common';

import { KarmaGroupDto } from './karma-group.dto';

export interface KarmaSettingsDto {
  is_active: boolean;
  min_completed_order_count_to_be_calculated: number;
  last_order_count_for_calculation: number;
  group_ranges: KarmaGroupDto<DateRangeDto>;
  group_restrictions: KarmaGroupDto<string[]>;
}
