import { MoneyEntity } from '@api/controllers/finance/entities/money.entity';
import { StatisticOrderProfitDto, StatisticProfitDto, MoneyDto } from '@data-access';
import { ApiProperty } from '@nestjs/swagger';

import { DriverProfitEntity } from './driver-profit.entity';

export class DriverProfitStatisticsEntity implements StatisticProfitDto {
  @ApiProperty({ type: MoneyEntity })
  public bonus: MoneyDto;

  @ApiProperty({ type: MoneyEntity })
  public fine: MoneyDto;

  @ApiProperty({ type: DriverProfitEntity })
  public order: StatisticOrderProfitDto;

  @ApiProperty({ type: MoneyEntity })
  public promotion: MoneyDto;

  @ApiProperty({ type: MoneyEntity })
  public tips: MoneyDto;

  @ApiProperty({ type: MoneyEntity })
  public total: MoneyDto;

  @ApiProperty({ type: MoneyEntity })
  public merchant: MoneyDto;
}
