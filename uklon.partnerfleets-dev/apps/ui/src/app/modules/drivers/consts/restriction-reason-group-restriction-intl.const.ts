import { Restriction } from '@constant';

export const RESTRICTION_REASON_GROUP_RESTRICTION_INTL = new Map<string, string>([
  [Restriction.FILTER_OFFER, 'Const.RestrictionReasonGroup.Enum.Restriction.FilterOffer'],
  [Restriction.BROAD_CAST, 'Const.RestrictionReasonGroup.Enum.Restriction.BroadCast'],
  [Restriction.FAST_SEARCH, 'Const.RestrictionReasonGroup.Enum.Restriction.FastSearch'],
  [Restriction.SECTOR_QUEUE, 'Const.RestrictionReasonGroup.Enum.Restriction.SectorQueue'],
  [Restriction.CASH, 'Const.RestrictionReasonGroup.Enum.Restriction.Cash'],
  [Restriction.CASHLESS, 'Const.RestrictionReasonGroup.Enum.Restriction.Cashless'],
  [Restriction.FINANCIAL_VERIFICATION, 'Const.RestrictionReasonGroup.Enum.Restriction.FinancialVerification'],
]);
