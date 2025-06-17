import { MoneyEntity } from '@api/controllers/finance/entities/money.entity';
import { StatisticOrderLossDto, MoneyDto } from '@data-access';
import { ApiProperty } from '@nestjs/swagger';

export class DriverOrderLossStatisticEntity implements StatisticOrderLossDto {
  @ApiProperty({ type: MoneyEntity })
  public total: MoneyDto;

  @ApiProperty({ type: MoneyEntity })
  public wallet: MoneyDto;
}
