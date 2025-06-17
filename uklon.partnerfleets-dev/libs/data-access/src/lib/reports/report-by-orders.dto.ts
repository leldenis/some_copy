import { Currency } from '@uklon/types';

import { MoneyDto } from '../finance/money.dto';
import { GroupedByEntrepreneurSplitPaymentDto, SplitPaymentDto } from '../finance/split-payment.dto';
import { StatisticLossDto, StatisticProfitDto } from '../statistic-details';

import { ReportByOrdersEmployeeDto } from './report-by-orders-driver.dto';

export enum ReportByOrderStatisticsCategory {
  // Нарахування бонусів за “бонус за замовлення”
  BONUS_ORDER = 'bonus_order',

  // Нарахування бонусів за тижневі бонусні програми (weekly)
  BONUS_WEEK = 'bonus_week',

  // Нарахування бонусів за бонусні програми по брендуванню (branding)
  BONUS_BRANDING = 'bonus_branding',

  // Нарахування бонусів за індивідуальні бонусні програми (individual)
  BONUS_INDIVIDUAL = 'bonus_individual',

  // Нарахування бонусів за “Гарантований дохід”
  BONUS_GUARANTEED = 'bonus_guaranteed',

  // Зарахування на баланс партнера заробітку за готівкове замовлення
  CASH_DRV_EARNINGS = 'cash_drv_earnings',

  // Зарахування на баланс партнера заробітку за промокод в готівковому замовленні
  CASH_DRV_EARNINGS_PC = 'cash_drv_earnings_pc',

  // Борг клієнта при оплаті поїздки готівкою   (тобто драйвер отримує готівкою більше, а на баланс - менше)
  CASH_DRV_EARNINGS_DEBT = 'cash_drv_earnings_debt',

  // Списання комісії Уклон з партнера (в готівковому замовленні)
  CASH_ORDER_FEE = 'cash_order_fee',

  // Списання з балансу партнера при готівковому замовленні
  CASH_WITHDRAWAL = 'cash_withdrawal',

  // Дохід від безготівкового замовлення без урахування промокоду
  CASHLESS_DRV_EARNINGS = 'cashless_drv_earnings',

  // Дохід від промокоду в замовленні
  CASHLESS_DRV_EARNINGS_PC = 'cashless_drv_earnings_pc',

  // Списання комісії Уклон з партнера (в безготівковому замовленні)
  CASHLESS_ORDER_FEE = 'cashless_order_fee',

  // Списання коштів з балансу партнера при ручному виводі
  CASHLESS_WITHDRAWAL = 'cashless_withdrawal',

  // Нарахування компенсації партнеру (всі компенсації окрім штрафів за невихід)
  COMPENSATION_RECEIVED = 'compensation_received',

  // Штраф партнера
  DRV_PENALTIES = 'drv_penalties',

  // Дохід від чайових
  TIPS = 'tips',

  // Списання коштів при переказі з гаманця на гаманець
  TRANSFER_IN = 'transfer_in',

  // Нарахування коштів при переказі з гаманця на гаманець
  TRANSFER_OUT = 'transfer_out',

  // Комісія фінансового провайдера при ручному виводі
  FC_COM_WITHDRAWAL = 'fc_com_withdrawal',

  // Компенсація партнеру за невихід пасажира (безготівкове замовлення)
  CASHLESS_DRV_EARNINGS_CUSTOMER_ABSENCE_ORDER_COMPENSATION = 'cashless_drv_earnings_customer_absence_order_compensation',

  // Компенсація партнеру за невихід пасажира (готівкове замовлення)
  CUSTOMER_ABSENCE_ORDER_COMPENSATION_RECEIVED = 'customer_absence_order_compensation_received',

  // Дохід драйвера по комісійній програмі (готівкове замовлення)
  CASH_ORDER_FEE_PROFIT = 'cash_order_fee_profit',

  // Дохід драйвера по комісійній програмі (безготівкове замовлення)
  CASHLESS_ORDER_FEE_PROFIT = 'cashless_order_fee_profit',

  // Проходження коштів з мерчанту на Р\Р при коригуванні балансу (B2B схема, модель потранзакційного коригування)
  PER_SPLIT_CASHLESS_WITHDRAWAL = 'persplit_cashless_withdrawal',

  // Списання з балансу при автоматичному виводі
  CASHLESS_ORDER_WITHDRAWAL = 'cashless_order_withdrawal',

  // Комісія фінансового провайдера при автоматичному виводі
  FC_COM_ORDER_WITHDRAWAL = 'fc_com_order_withdrawal',
}

export interface ReportByOrderStatisticsDto {
  category: ReportByOrderStatisticsCategory;
  total: number;
}

export interface ReportByOrdersDto {
  has_error: boolean;
  driver?: ReportByOrdersEmployeeDto;
  courier?: ReportByOrdersEmployeeDto;
  profit: StatisticProfitDto;
  loss: StatisticLossDto;
  total_orders_count?: number;
  total_distance_meters?: number;
  total_distance_to_pickup_meters?: number;
  total_executing_time?: number;
  average_price_per_kilometer: MoneyDto;
  statistics: ReportByOrderStatisticsDto[];
  split_payments?: SplitPaymentDto[];
  grouped_splits?: GroupedByEntrepreneurSplitPaymentDto;
  currency?: Currency;
  online_time_seconds?: number;
  chain_time_seconds?: number;
  offer_time_seconds?: number;
  broadcast_time_seconds?: number;
  total_time_from_accepted_to_running?: number;
}

export interface DriversOrdersReportBonusDto {
  total: MoneyDto;
  order: MoneyDto;
  week: MoneyDto;
  branding: MoneyDto;
  individual: MoneyDto;
  guaranteed: MoneyDto;
}

export interface DriversOrdersReportProfitDto {
  total: MoneyDto;
  cash: MoneyDto;
  wallet: MoneyDto;
  merchant: MoneyDto;
  card: MoneyDto;
  order: MoneyDto;
}

export interface DriversOrdersReportCompensationDto {
  total: MoneyDto;
  absence: MoneyDto;
  ticket: MoneyDto;
}

export interface DriversOrdersReportCommissionDto {
  total: MoneyDto;
  actual: MoneyDto;
}

export interface DriversOrdersReportTransferDto {
  replenishment: MoneyDto;
  from_balance: MoneyDto;
}

export interface DriversOrdersReportDto {
  driver?: ReportByOrdersEmployeeDto;
  courier?: ReportByOrdersEmployeeDto;
  total_orders_count: number;
  total_distance_meters: number;
  total_distance_to_pickup_meters: number;
  total_executing_time: number;
  average_price_per_kilometer: MoneyDto;
  average_order_price_per_kilometer: MoneyDto;
  average_order_price_per_hour: MoneyDto;
  orders_per_hour: number;
  bonuses: DriversOrdersReportBonusDto;
  compensation: DriversOrdersReportCompensationDto;
  tips: MoneyDto;
  penalties: MoneyDto;
  profit: DriversOrdersReportProfitDto;
  commission: DriversOrdersReportCommissionDto;
  transfers: DriversOrdersReportTransferDto;
  split_payments: SplitPaymentDto[];
  grouped_splits: GroupedByEntrepreneurSplitPaymentDto;
  currency: Currency;
  online_time_seconds: number;
  chain_time_seconds: number;
  offer_time_seconds: number;
  broadcast_time_seconds: number;
  total_time_from_accepted_to_running: number;
}
