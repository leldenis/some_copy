import { NumberRangeEntity } from '@api/controllers/drivers/entities';
import { CommissionRateDto, DateRangeDto } from '@data-access';
import { ApiProperty } from '@nestjs/swagger';

export class CommissionRateEntity implements CommissionRateDto {
  @ApiProperty({ type: NumberRangeEntity })
  public order_completed_count_range: DateRangeDto;

  @ApiProperty({ type: Number })
  public value: number;
}
