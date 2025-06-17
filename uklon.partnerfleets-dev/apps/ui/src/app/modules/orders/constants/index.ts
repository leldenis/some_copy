import { FleetMerchant, FleetOrderRecordDto, GroupedByEntrepreneurSplitPaymentDto } from '@data-access';
import { DEFAULT_LIMIT } from '@ui/shared/consts';
import _ from 'lodash';

export const DEFAULT_REPORTS_OFFSET = 0;

export const DEFAULT_REPORTS_QUERY_PARAMS = {
  offset: DEFAULT_REPORTS_OFFSET,
  limit: DEFAULT_LIMIT,
};

export const getMerchants = (reports: FleetOrderRecordDto[]): string[] => {
  const withMerchants = reports.filter(({ grouped_splits }) => !_.isEmpty(grouped_splits));

  if (withMerchants.length === 0) return [];

  const allMerchants = withMerchants.reduce((acc, { grouped_splits }) => {
    const merchants = Object.keys(grouped_splits).reduce<FleetMerchant[]>((acc2, val) => {
      return [...acc2, ...grouped_splits[val].map(({ payment_provider }) => payment_provider)];
    }, []);

    merchants.forEach((merchant) => {
      acc.add(merchant);
    });
    return acc;
  }, new Set<string>());

  return [...allMerchants];
};

export const getMerchantsIncome = (
  grouped_splits: GroupedByEntrepreneurSplitPaymentDto,
  merchants: string[],
): number[] => {
  if (_.isEmpty(grouped_splits)) {
    // generate 2 columns (merchant column/commission column) for each merchant
    return merchants.flatMap(() => [0, 0]);
  }

  let map: Record<string, { total: number; fee: number }> = {};

  Object.keys(grouped_splits).forEach((key) => {
    grouped_splits[key].forEach(({ payment_provider, total: { amount }, fee }) => {
      map = map[payment_provider]
        ? { ...map, [payment_provider]: { total: map[payment_provider].total + amount, fee: fee?.amount } }
        : { ...map, [payment_provider]: { total: amount, fee: fee?.amount } };
    });
  });

  return merchants.filter(Boolean).flatMap((merchant) => [map[merchant]?.total ?? 0, map[merchant]?.fee ?? 0]);
};
