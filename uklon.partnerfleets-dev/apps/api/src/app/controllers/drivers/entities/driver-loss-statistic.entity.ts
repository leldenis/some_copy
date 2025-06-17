import { StatisticLossDto, StatisticOrderLossDto, MoneyDto } from '@data-access';
import { ApiProperty } from '@nestjs/swagger';

import { MoneyEntity } from '../../finance/entities/money.entity';

import { DriverOrderLossStatisticEntity } from './driver-order-loss-statistic.entity';

export class DriverLossStatisticEntity implements StatisticLossDto {
  @ApiProperty({ type: DriverOrderLossStatisticEntity })
  public order: StatisticOrderLossDto;

  @ApiProperty({ type: MoneyEntity })
  public total: MoneyDto;
}
