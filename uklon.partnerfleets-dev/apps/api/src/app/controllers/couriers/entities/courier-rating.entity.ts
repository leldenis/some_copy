import { CourierRatingDto } from '@data-access';
import { ApiProperty } from '@nestjs/swagger';

export class CourierRatingEntity implements CourierRatingDto {
  @ApiProperty({ type: Number })
  public value: number;

  @ApiProperty({ type: Number })
  public marks_count: number;
}
