import { KarmaGroupDto, DateRangeDto } from '@data-access';
import { ApiProperty } from '@nestjs/swagger';

import { NumberRangeEntity } from './number-range.entity';

export class KarmaGroupRangesEntity implements KarmaGroupDto<DateRangeDto> {
  @ApiProperty({ type: NumberRangeEntity })
  public first_priority: DateRangeDto;

  @ApiProperty({ type: NumberRangeEntity })
  public offers_and_broadcast_blocked: DateRangeDto;

  @ApiProperty({ type: NumberRangeEntity })
  public offers_blocked: DateRangeDto;

  @ApiProperty({ type: NumberRangeEntity })
  public second_priority: DateRangeDto;
}
