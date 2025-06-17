import { MoneyEntity } from '@api/controllers/finance/entities/money.entity';
import { StatisticOrderProfitDto, MoneyDto } from '@data-access';
import { ApiProperty } from '@nestjs/swagger';

export class DriverProfitEntity implements StatisticOrderProfitDto {
  @ApiProperty({ type: MoneyEntity })
  public card: MoneyDto;

  @ApiProperty({ type: MoneyEntity })
  public cash: MoneyDto;

  @ApiProperty({ type: MoneyEntity })
  public total: MoneyDto;

  @ApiProperty({ type: MoneyEntity })
  public wallet: MoneyDto;
}
