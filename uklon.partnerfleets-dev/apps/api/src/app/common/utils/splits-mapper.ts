import {
  FleetMerchant,
  GroupedByEntrepreneurSplitPaymentDto,
  IndividualEntrepreneurDto,
  MoneyDto,
  SplitPaymentDto,
} from '@data-access';

import { Currency } from '@uklon/types';

const PAYMENT_PROVIDER_MAP = {
  ipay: FleetMerchant.IPAY,
  fondy: FleetMerchant.FONDY,
  platon: FleetMerchant.PLATON,
};

export function getMerchantIncome(payments: SplitPaymentDto[], currency: Currency, orderReporting = false): MoneyDto {
  if (!payments?.length) return { amount: 0, currency };

  return {
    amount: payments?.reduce((acc, { total: { amount } }) => acc + amount * (orderReporting ? 100 : 1), 0) || 0,
    currency: payments[0]?.total?.currency || currency,
  };
}

export function mapSplits(
  entrepreneurs: IndividualEntrepreneurDto[],
  splits: SplitPaymentDto[],
  multiplyFee = false,
): GroupedByEntrepreneurSplitPaymentDto {
  if (!splits?.length || !entrepreneurs?.length) return {};

  const groupedSplits: GroupedByEntrepreneurSplitPaymentDto = {};
  entrepreneurs.forEach(({ name, payment_providers }) => {
    payment_providers.forEach(({ merchant_id }) => {
      let split = splits.find(({ merchant_id: id }) => id === merchant_id);

      if (!split) return;

      split = {
        ...split,
        payment_provider: PAYMENT_PROVIDER_MAP[split.payment_provider] ?? split.payment_provider,
        fee: multiplyFee ? { ...split.fee, amount: split.fee.amount * 100 } : split.fee,
      };

      if (name in groupedSplits) {
        groupedSplits[name].push(split);
      } else {
        groupedSplits[name] = [split];
      }
    });
  });

  return Object.fromEntries(Object.entries(groupedSplits).filter(([_, v]) => v.length > 0));
}

export function orderReportingSplits(splits: SplitPaymentDto[]): SplitPaymentDto[] {
  if (!splits?.length) return [];

  const groupedSplits = {};

  splits.forEach((split) => {
    groupedSplits[split.merchant_id] = groupedSplits[split.merchant_id]
      ? {
          ...split,
          total: {
            ...split.total,
            amount: groupedSplits[split.merchant_id].total.amount + split.total.amount * 100,
          },
        }
      : {
          ...split,
          total: { ...split.total, amount: split.total.amount * 100 },
        };
  });

  return Object.values(groupedSplits);
}
