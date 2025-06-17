import { DateRangeDto } from '@data-access';
import { ApiProperty } from '@nestjs/swagger';

export class NumberRangeEntity implements DateRangeDto {
  @ApiProperty({ type: Number })
  public from: number;

  @ApiProperty({ type: Number })
  public to: number;
}
