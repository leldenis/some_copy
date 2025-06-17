import { KarmaGroupDto, KarmaSettingsDto, DateRangeDto } from '@data-access';
import { ApiProperty } from '@nestjs/swagger';

import { KarmaGroupRangesEntity } from './karma-group-ranges.entity';
import { KarmaGroupRestrictionsEntity } from './karma-group-restrictions.entity';

export class KarmaSettingsEntity implements KarmaSettingsDto {
  @ApiProperty({ type: KarmaGroupRangesEntity })
  public group_ranges: KarmaGroupDto<DateRangeDto>;

  @ApiProperty({ type: KarmaGroupRestrictionsEntity })
  public group_restrictions: KarmaGroupDto<string[]>;

  @ApiProperty({ type: Boolean })
  public is_active: boolean;

  @ApiProperty({ type: Number })
  public last_order_count_for_calculation: number;

  @ApiProperty({ type: Number })
  public min_completed_order_count_to_be_calculated: number;
}
