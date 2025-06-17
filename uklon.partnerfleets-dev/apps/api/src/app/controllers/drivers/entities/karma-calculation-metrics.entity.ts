import { KarmaCalculationMetricsDto } from '@data-access';
import { ApiProperty } from '@nestjs/swagger';

export class KarmaCalculationMetricsEntity implements KarmaCalculationMetricsDto {
  @ApiProperty({ type: Number })
  public completed_count: number;

  @ApiProperty({ type: Number })
  public rejected_count: number;

  @ApiProperty({ type: Number })
  public canceled_count: number;
}
