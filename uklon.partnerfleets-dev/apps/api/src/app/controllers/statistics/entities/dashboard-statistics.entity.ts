import { MoneyEntity } from '@api/controllers/finance/entities/money.entity';
import {
  DashboardStatisticsHistogramItemDto,
  DashboardStatisticsDto,
  DashboardStatisticsProductItemDto,
  DashboardStatisticsTopDriverDto,
  MoneyDto,
} from '@data-access';
import { ApiProperty } from '@nestjs/swagger';

import { DashboardHistogramItemEntity } from './dashboard-histogram-item.entity';
import { DashboardProductItemEntity } from './dashboard-product-item.entity';
import { DashboardTopDriverEntity } from './dashboard-top-driver.entity';

export class DashboardStatisticsEntity implements DashboardStatisticsDto {
  @ApiProperty({ type: MoneyEntity })
  public gross_income: MoneyDto;

  @ApiProperty({ type: MoneyEntity })
  public fee_amount: MoneyDto;

  @ApiProperty({ type: MoneyEntity })
  public profit_amount: MoneyDto;

  @ApiProperty({ type: Number })
  public total_orders_count: number;

  @ApiProperty({ type: Number })
  public total_distance_meters: number;

  @ApiProperty({ type: MoneyEntity })
  public average_order_cost: MoneyDto;

  @ApiProperty({ type: MoneyEntity })
  public average_price_per_kilometer: MoneyDto;

  @ApiProperty({ type: MoneyEntity })
  public gross_amount_cash: MoneyDto;

  @ApiProperty({ type: MoneyEntity })
  public gross_amount_cashless: MoneyDto;

  @ApiProperty({ type: MoneyEntity })
  public bonuses_amount: MoneyDto;

  @ApiProperty({ type: DashboardTopDriverEntity, isArray: true })
  public top_drivers: DashboardStatisticsTopDriverDto[];

  @ApiProperty({ type: DashboardHistogramItemEntity, isArray: true })
  public histogram_items: DashboardStatisticsHistogramItemDto[];

  @ApiProperty({ type: DashboardProductItemEntity, isArray: true })
  public product_items: DashboardStatisticsProductItemDto[];
}
