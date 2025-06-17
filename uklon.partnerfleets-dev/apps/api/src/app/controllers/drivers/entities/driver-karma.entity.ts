import { KarmaCalculationMetricsEntity } from '@api/controllers/drivers/entities/karma-calculation-metrics.entity';
import { KarmaGroup } from '@constant';
import { DriverKarmaDto, KarmaCalculationMetricsDto } from '@data-access';
import { ApiProperty } from '@nestjs/swagger';

export class DriverKarmaEntity implements DriverKarmaDto {
  @ApiProperty({ type: KarmaCalculationMetricsEntity })
  public calculation_metrics: KarmaCalculationMetricsDto;

  @ApiProperty({ type: Number })
  public orders_to_calculation: number;

  @ApiProperty({ type: Number })
  public reset_count: number;

  @ApiProperty({ enum: KarmaGroup, enumName: 'KarmaGroup' })
  public group: KarmaGroup;

  @ApiProperty({ type: Number })
  public value: number;
}
