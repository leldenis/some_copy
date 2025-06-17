import { MoneyEntity } from '@api/controllers/finance/entities/money.entity';
import { ReportByOrdersDriverEntity } from '@api/controllers/reports';
import { SplitPaymentEntity } from '@api/controllers/reports/entities/split-payment.entity';
import {
  StatisticLossDto,
  StatisticProfitDto,
  ReportByOrdersEmployeeDto,
  ReportByOrdersDto,
  SplitPaymentDto,
  GroupedByEntrepreneurSplitPaymentDto,
  MoneyDto,
  ReportByOrderStatisticsDto,
  ReportByOrderStatisticsCategory,
  DriversOrdersReportDto,
  DriversOrdersReportBonusDto,
  DriversOrdersReportCompensationDto,
  DriversOrdersReportProfitDto,
  DriversOrdersReportCommissionDto,
  DriversOrdersReportTransferDto,
} from '@data-access';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { Currency } from '@uklon/types';

import { DriverLossStatisticEntity, DriverProfitStatisticsEntity } from '../../drivers/entities';

export class ReportByOrderStatisticsEntitiy implements ReportByOrderStatisticsDto {
  @ApiProperty({ enum: ReportByOrderStatisticsCategory, enumName: 'ReportByOrderStatisticsCategory' })
  public category: ReportByOrderStatisticsCategory;

  @ApiProperty({ type: Number })
  public total: number;
}

export class ReportByOrdersEntity implements ReportByOrdersDto {
  @ApiProperty({ type: Boolean })
  public has_error: boolean;

  @ApiPropertyOptional({ type: ReportByOrdersDriverEntity })
  public driver?: ReportByOrdersEmployeeDto;

  @ApiPropertyOptional({ type: ReportByOrdersDriverEntity })
  public courier?: ReportByOrdersEmployeeDto;

  @ApiProperty({ type: DriverProfitStatisticsEntity })
  public profit: StatisticProfitDto;

  @ApiProperty({ type: DriverLossStatisticEntity })
  public loss: StatisticLossDto;

  @ApiPropertyOptional({ type: Number })
  public total_orders_count?: number;

  @ApiPropertyOptional({ type: Number })
  public total_distance_meters?: number;

  @ApiPropertyOptional({ type: Number })
  public total_distance_to_pickup_meters?: number;

  @ApiPropertyOptional({ type: Number })
  public total_executing_time?: number;

  @ApiProperty({ type: MoneyEntity })
  public average_price_per_kilometer: MoneyDto;

  @ApiProperty({ type: ReportByOrderStatisticsEntitiy, isArray: true })
  public statistics: ReportByOrderStatisticsDto[];

  @ApiPropertyOptional({ type: SplitPaymentEntity, isArray: true })
  public split_payments?: SplitPaymentDto[];

  @ApiPropertyOptional({ type: Object })
  public grouped_splits?: GroupedByEntrepreneurSplitPaymentDto;

  @ApiPropertyOptional({ enum: Currency, enumName: 'Currency' })
  public currency?: Currency;

  @ApiPropertyOptional({ type: Number })
  public online_time_seconds?: number;

  @ApiPropertyOptional({ type: Number })
  public chain_time_seconds?: number;

  @ApiPropertyOptional({ type: Number })
  public offer_time_seconds?: number;

  @ApiPropertyOptional({ type: Number })
  public broadcast_time_seconds?: number;

  @ApiPropertyOptional({ type: Number })
  public total_time_from_accepted_to_running?: number;
}

export class DriversOrdersReportBonusEntity implements DriversOrdersReportBonusDto {
  @ApiProperty({ type: MoneyEntity })
  public total: MoneyDto;

  @ApiProperty({ type: MoneyEntity })
  public order: MoneyDto;

  @ApiProperty({ type: MoneyEntity })
  public week: MoneyDto;

  @ApiProperty({ type: MoneyEntity })
  public branding: MoneyDto;

  @ApiProperty({ type: MoneyEntity })
  public individual: MoneyDto;

  @ApiProperty({ type: MoneyEntity })
  public guaranteed: MoneyDto;
}

export class DriversOrdersReportCompensationEntity implements DriversOrdersReportCompensationDto {
  @ApiProperty({ type: MoneyEntity })
  public total: MoneyDto;

  @ApiProperty({ type: MoneyEntity })
  public absence: MoneyDto;

  @ApiProperty({ type: MoneyEntity })
  public ticket: MoneyDto;
}

export class DriversOrdersReportProfitEntity implements DriversOrdersReportProfitDto {
  @ApiProperty({ type: MoneyEntity })
  public total: MoneyDto;

  @ApiProperty({ type: MoneyEntity })
  public cash: MoneyDto;

  @ApiProperty({ type: MoneyEntity })
  public wallet: MoneyDto;

  @ApiProperty({ type: MoneyEntity })
  public merchant: MoneyDto;

  @ApiProperty({ type: MoneyEntity })
  public card: MoneyDto;

  @ApiProperty({ type: MoneyEntity })
  public order: MoneyDto;
}

export class DriversOrdersReportCommissionEntity implements DriversOrdersReportCommissionDto {
  @ApiProperty({ type: MoneyEntity })
  public total: MoneyDto;

  @ApiProperty({ type: MoneyEntity })
  public actual: MoneyDto;
}

export class DriversOrdersReportTransferEntity implements DriversOrdersReportTransferDto {
  @ApiProperty({ type: MoneyEntity })
  public replenishment: MoneyDto;

  @ApiProperty({ type: MoneyEntity })
  public from_balance: MoneyDto;
}

export class DriversOrdersReportEntity implements DriversOrdersReportDto {
  @ApiPropertyOptional({ type: ReportByOrdersDriverEntity })
  public driver?: ReportByOrdersEmployeeDto;

  @ApiPropertyOptional({ type: ReportByOrdersDriverEntity })
  public courier?: ReportByOrdersEmployeeDto;

  @ApiProperty({ type: Number })
  public total_orders_count: number;

  @ApiProperty({ type: Number })
  public total_distance_meters: number;

  @ApiProperty({ type: Number })
  public total_distance_to_pickup_meters: number;

  @ApiProperty({ type: Number })
  public total_executing_time: number;

  @ApiProperty({ type: MoneyEntity })
  public average_price_per_kilometer: MoneyDto;

  @ApiProperty({ type: MoneyEntity })
  public average_order_price_per_kilometer: MoneyDto;

  @ApiProperty({ type: MoneyEntity })
  public average_order_price_per_hour: MoneyDto;

  @ApiProperty({ type: Number })
  public orders_per_hour: number;

  @ApiProperty({ type: DriversOrdersReportBonusEntity })
  public bonuses: DriversOrdersReportBonusDto;

  @ApiProperty({ type: DriversOrdersReportCompensationEntity })
  public compensation: DriversOrdersReportCompensationDto;

  @ApiProperty({ type: MoneyEntity })
  public tips: MoneyDto;

  @ApiProperty({ type: MoneyEntity })
  public penalties: MoneyDto;

  @ApiProperty({ type: DriversOrdersReportProfitEntity })
  public profit: DriversOrdersReportProfitDto;

  @ApiProperty({ type: DriversOrdersReportCommissionEntity })
  public commission: DriversOrdersReportCommissionDto;

  @ApiProperty({ type: DriversOrdersReportTransferEntity })
  public transfers: DriversOrdersReportTransferDto;

  @ApiProperty({ type: SplitPaymentEntity, isArray: true })
  public split_payments: SplitPaymentDto[];

  @ApiProperty({ type: Object })
  public grouped_splits: GroupedByEntrepreneurSplitPaymentDto;

  @ApiProperty({ enum: Currency, enumName: 'Currency' })
  public currency: Currency;

  @ApiProperty({ type: Number })
  public online_time_seconds: number;

  @ApiProperty({ type: Number })
  public chain_time_seconds: number;

  @ApiProperty({ type: Number })
  public offer_time_seconds: number;

  @ApiProperty({ type: Number })
  public broadcast_time_seconds: number;

  @ApiProperty({ type: Number })
  public total_time_from_accepted_to_running: number;
}
