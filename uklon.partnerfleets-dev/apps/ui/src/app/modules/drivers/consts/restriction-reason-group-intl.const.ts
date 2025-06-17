import { RestrictionReason } from '@constant';

import { RestrictionsReasonGroup } from '../types';

export const RESTRICTION_REASON_GROUP_INTL = new Map<RestrictionsReasonGroup, string>([
  [RestrictionReason.CANCEL_FREQUENCY, 'Const.RestrictionReasonGroup.RestrictedBy.RestrictionReason.CancelFrequency'],
  [RestrictionReason.BALANCE, 'Const.RestrictionReasonGroup.RestrictedBy.RestrictionReason.Balance'],
  [RestrictionReason.ACTIVITY_RATE, 'Const.RestrictionReasonGroup.RestrictedBy.RestrictionReason.ActiveOrdersLimit'],
  [RestrictionReason.KARMA, 'Const.RestrictionReasonGroup.RestrictedBy.RestrictionReason.Karma'],
  [RestrictionReason.MANAGER, 'Const.RestrictionReasonGroup.RestrictedBy.RestrictionReason.Manager'],
  [RestrictionReason.FLEET, 'Const.RestrictionReasonGroup.RestrictedBy.RestrictionReason.Fleet'],
  [RestrictionReason.TICKET, 'Const.RestrictionReasonGroup.RestrictedBy.RestrictionReason.Ticket'],
  ['cash', 'Const.RestrictionReasonGroup.Type.Restriction.Cash'],
  [RestrictionReason.ACTIVITY_RATE, 'Const.RestrictionReasonGroup.Type.Restriction.ActivityRate'],
  [RestrictionReason.FINANCIAL_VERIFICATION, 'Const.RestrictionReasonGroup.Enum.Restriction.FinancialVerification'],
]);
