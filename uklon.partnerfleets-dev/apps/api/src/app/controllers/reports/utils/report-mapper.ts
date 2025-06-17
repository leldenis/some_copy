import { getMerchantIncome } from '@api/common/utils/splits-mapper';
import {
  DriversOrdersReportDto,
  DriversOrdersReportBonusDto,
  MoneyDto,
  ReportByOrdersDto,
  ReportByOrderStatisticsDto,
} from '@data-access';

import { Currency } from '@uklon/types';

const TOTAL_PROFIT_FIELDS = [
  'bonus_branding',
  'bonus_guaranteed',
  'bonus_individual',
  'bonus_order',
  'bonus_week',
  'cashless_drv_earnings',
  'cashless_drv_earnings_customer_absence_order_compensation',
  'cashless_drv_earnings_pc',
  'cashless_order_fee',
  'cashless_order_fee_profit',
  'cash_drv_earnings',
  'cash_drv_earnings_debt',
  'cash_drv_earnings_pc',
  'cash_order_fee',
  'cash_order_fee_profit',
  'compensation_received',
  'customer_absence_order_compensation_received',
  'fc_com_order_withdrawal',
  'share_drv_earnings',
  'share_order_fee',
  'tips',
  'transfer_out_fleet_fee',
  'drv_penalties',
];
const ORDER_PROFIT_FIELDS = [
  'cashless_drv_earnings',
  'cashless_drv_earnings_customer_absence_order_compensation',
  'cashless_drv_earnings_pc',
  'cash_drv_earnings',
  'cash_drv_earnings_debt',
  'cash_drv_earnings_pc',
  'customer_absence_order_compensation_received',
  'fc_com_order_withdrawal',
];
const TOTAL_WALLET_FIELDS = [
  'cash_drv_earnings_debt',
  'cash_drv_earnings_pc',
  'cashless_drv_earnings',
  'cashless_drv_earnings_pc',
  'compensation',
  'fc_com_order_withdrawal',
  'cashless_order_withdrawal',
];
const BONUSES_FIELDS = ['bonus_order', 'bonus_week', 'bonus_branding', 'bonus_individual', 'bonus_guaranteed'];
const COMPENSATIONS_FIELDS = [
  'cashless_drv_earnings_customer_absence_order_compensation',
  'customer_absence_order_compensation_received',
  'compensation_received',
];
const COMMISSION_FIELDS_ACTUAL = [
  'cash_order_fee',
  'cashless_order_fee',
  'cashless_order_fee_profit',
  'cash_order_fee_profit',
];
const COMMISSION_FIELDS_TOTAL = ['cash_order_fee', 'cashless_order_fee'];

const categoryAmount = (fields: string[], stats: ReportByOrderStatisticsDto[]): number =>
  fields.reduce((acc, value) => {
    const foundCategory = stats.find(({ category }) => category === value);
    return acc + (foundCategory?.total || 0);
  }, 0) * 100;

const toMoneyDto = (fields: string[], stats: ReportByOrderStatisticsDto[], currency: Currency): MoneyDto => {
  return {
    amount: categoryAmount(fields, stats),
    currency,
  };
};

export function reportMapper({
  statistics,
  currency,
  split_payments,
  total_orders_count,
  total_distance_meters,
  total_distance_to_pickup_meters,
  online_time_seconds,
}: ReportByOrdersDto): Partial<DriversOrdersReportDto> {
  const bonuses: DriversOrdersReportBonusDto = {
    total: toMoneyDto(BONUSES_FIELDS, statistics, currency),
    branding: toMoneyDto(['bonus_branding'], statistics, currency),
    guaranteed: toMoneyDto(['bonus_guaranteed'], statistics, currency),
    individual: toMoneyDto(['bonus_individual'], statistics, currency),
    order: toMoneyDto(['bonus_order'], statistics, currency),
    week: toMoneyDto(['bonus_week'], statistics, currency),
  };

  const tips = toMoneyDto(['tips'], statistics, currency);

  const compensation = {
    total: toMoneyDto(COMPENSATIONS_FIELDS, statistics, currency),
    absence: toMoneyDto(
      ['cashless_drv_earnings_customer_absence_order_compensation', 'customer_absence_order_compensation_received'],
      statistics,
      currency,
    ),
    ticket: toMoneyDto(['compensation_received'], statistics, currency),
  };

  const penalties = toMoneyDto(['drv_penalties'], statistics, currency);

  const commission = {
    total: toMoneyDto(COMMISSION_FIELDS_TOTAL, statistics, currency),
    actual: toMoneyDto(COMMISSION_FIELDS_ACTUAL, statistics, currency),
  };

  const merchant = getMerchantIncome(split_payments, currency);

  const profit = {
    merchant,
    total: toMoneyDto(TOTAL_PROFIT_FIELDS, statistics, currency),
    order: toMoneyDto(ORDER_PROFIT_FIELDS, statistics, currency),
    wallet: { amount: categoryAmount(TOTAL_WALLET_FIELDS, statistics) - merchant.amount, currency },
    cash: {
      amount: categoryAmount(['cash_drv_earnings'], statistics) - categoryAmount(['compensation'], statistics),
      currency,
    },
    card: {
      amount: Math.abs(categoryAmount(['cashless_order_withdrawal'], statistics)),
      currency,
    },
  };

  const averagePricePerKilometer = total_distance_meters
    ? +(profit.total.amount / (total_distance_meters / 1000)).toFixed(2)
    : 0;

  const totalDistance = (total_distance_meters || 0) + (total_distance_to_pickup_meters || 0);
  const averageOrderPricePerKilometer = totalDistance ? +(profit.total.amount / (totalDistance / 1000)).toFixed(2) : 0;

  const averageOrderPricePerHour = online_time_seconds ? (profit.total.amount / online_time_seconds) * 60 * 60 : 0;

  const ordersPerHour =
    total_orders_count && online_time_seconds ? +((total_orders_count / online_time_seconds) * 60 * 60).toFixed(2) : 0;

  const transfers = {
    replenishment: toMoneyDto(['replenishment'], statistics, currency),
    from_balance: toMoneyDto(['transfer_in'], statistics, currency),
  };

  return {
    profit,
    bonuses,
    tips,
    compensation,
    penalties,
    commission,
    average_price_per_kilometer: {
      amount: averagePricePerKilometer,
      currency,
    },
    average_order_price_per_kilometer: {
      amount: averageOrderPricePerKilometer,
      currency,
    },
    average_order_price_per_hour: {
      amount: averageOrderPricePerHour,
      currency,
    },
    orders_per_hour: ordersPerHour,
    transfers,
    currency,
    split_payments,
  };
}
