import { DriverEntity } from '@api/controllers/drivers/entities/driver.entity';
import { MoneyEntity } from '@api/controllers/finance/entities/money.entity';
import { DashboardStatisticsTopDriverDto, FleetDriverDto, MoneyDto } from '@data-access';
import { ApiProperty } from '@nestjs/swagger';

export class DashboardTopDriverEntity implements DashboardStatisticsTopDriverDto {
  @ApiProperty({ type: DriverEntity })
  public driver: FleetDriverDto;

  @ApiProperty({ type: MoneyEntity })
  public total_income: MoneyDto;

  @ApiProperty({ type: Number })
  public total_orders_count: number;

  @ApiProperty({ type: Number })
  public cancel_percent: number;

  @ApiProperty({ type: Number })
  public karma: number;

  @ApiProperty({ type: String })
  public karma_group: string;

  @ApiProperty({ type: Number })
  public rating: number;
}
