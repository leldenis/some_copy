import { MoneyEntity } from '@api/controllers/finance/entities/money.entity';
import { DashboardStatisticsHistogramItemDto, MoneyDto } from '@data-access';
import { ApiProperty } from '@nestjs/swagger';

export class DashboardHistogramItemEntity implements DashboardStatisticsHistogramItemDto {
  @ApiProperty({ type: Number })
  public date: number;

  @ApiProperty({ type: MoneyEntity })
  public total_bonus: MoneyDto;

  @ApiProperty({ type: MoneyEntity })
  public total_compensations: MoneyDto;

  @ApiProperty({ type: MoneyEntity })
  public total_penalties: MoneyDto;

  @ApiProperty({ type: MoneyEntity })
  public total_cash_earnings: MoneyDto;

  @ApiProperty({ type: MoneyEntity })
  public total_cashless_earnings: MoneyDto;

  @ApiProperty({ type: MoneyEntity })
  public total_tips: MoneyDto;

  @ApiProperty({ type: MoneyEntity })
  public total_fee: MoneyDto;
}
