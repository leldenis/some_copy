import { MoneyEntity } from '@api/controllers/finance/entities/money.entity';
import { MoneyDto, VehicleOrderReportItemDto } from '@data-access';
import { ApiProperty } from '@nestjs/swagger';

export class VehicleOrderReportEntity implements VehicleOrderReportItemDto {
  @ApiProperty({ type: String })
  public vehicle_id: string;

  @ApiProperty({ type: String })
  public license_plate: string;

  @ApiProperty({ type: String })
  public make: string;

  @ApiProperty({ type: String })
  public model: string;

  @ApiProperty({ type: String })
  public color: string;

  @ApiProperty({ type: Number })
  public production_year: number;

  @ApiProperty({ type: Boolean })
  public is_branded: boolean;

  @ApiProperty({ type: Number })
  public branded_days: number;

  @ApiProperty({ type: Number })
  public dispatching_priority_days: number;

  @ApiProperty({ type: Boolean })
  public has_dispatching_priority: boolean;

  @ApiProperty({ type: Number })
  public total_orders_count: number;

  @ApiProperty({ type: Number })
  public total_distance_meters: number;

  @ApiProperty({ type: MoneyEntity })
  public gross_income: MoneyDto;

  @ApiProperty({ type: MoneyEntity })
  public profit_amount: MoneyDto;

  @ApiProperty({ type: MoneyEntity })
  public fee_amount: MoneyDto;

  @ApiProperty({ type: MoneyEntity })
  public total_cash_earnings: MoneyDto;

  @ApiProperty({ type: MoneyEntity })
  public total_cashless_earnings: MoneyDto;

  @ApiProperty({ type: MoneyEntity })
  public average_order_cost: MoneyDto;

  @ApiProperty({ type: MoneyEntity })
  public total_bonus: MoneyDto;

  @ApiProperty({ type: MoneyEntity })
  public total_compensations: MoneyDto;

  @ApiProperty({ type: MoneyEntity })
  public total_tips: MoneyDto;

  @ApiProperty({ type: MoneyEntity })
  public total_penalties: MoneyDto;

  @ApiProperty({ type: MoneyEntity })
  public average_cashless_order_cost: MoneyDto;

  @ApiProperty({ type: MoneyEntity })
  public average_cash_order_cost: MoneyDto;

  @ApiProperty({ type: MoneyEntity })
  public average_price_per_kilometer: MoneyDto;

  @ApiProperty({ type: Number })
  public online_time_seconds: number;

  @ApiProperty({ type: Number })
  public orders_execution_time_seconds: number;

  @ApiProperty({ type: Number })
  public orders_per_hour: number;
}
