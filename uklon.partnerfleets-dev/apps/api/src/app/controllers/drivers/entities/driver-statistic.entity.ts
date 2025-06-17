import { DriverLossStatisticEntity } from '@api/controllers/drivers/entities/driver-loss-statistic.entity';
import { DriverProfitStatisticsEntity } from '@api/controllers/drivers/entities/driver-profit-statistics.entity';
import { MoneyEntity } from '@api/controllers/finance/entities/money.entity';
import { MoneyDto, StatisticDetailsDto, StatisticLossDto, StatisticProfitDto } from '@data-access';
import { ApiProperty } from '@nestjs/swagger';

export class DriverStatisticEntity implements StatisticDetailsDto {
  @ApiProperty({ type: Number })
  public cancellation_percentage: number;

  @ApiProperty({ type: Number })
  public completed_orders: number;

  @ApiProperty({ type: MoneyEntity })
  public earnings_for_period: MoneyDto;

  @ApiProperty({ type: MoneyEntity })
  public gross_income: MoneyDto;

  @ApiProperty({ type: DriverProfitStatisticsEntity })
  public profit: StatisticProfitDto;

  @ApiProperty({ type: Number })
  public rating: number;

  @ApiProperty({ type: DriverLossStatisticEntity })
  public loss: StatisticLossDto;

  @ApiProperty({ type: Number })
  public total_distance_meters: number;
}
