import { MoneyEntity } from '@api/controllers/finance/entities/money.entity';
import { DashboardStatisticsProductItemDto, MoneyDto } from '@data-access';
import { ApiProperty } from '@nestjs/swagger';

export class DashboardProductItemEntity implements DashboardStatisticsProductItemDto {
  @ApiProperty({ type: String })
  public product_code: string;

  @ApiProperty({ type: MoneyEntity })
  public earnings: MoneyDto;

  @ApiProperty({ type: Number })
  public percent: number;
}
