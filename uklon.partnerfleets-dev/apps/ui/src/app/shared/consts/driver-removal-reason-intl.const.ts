import { DriverRemovalReason } from '@constant';

export const DRIVER_REMOVAL_REASON_INTL = new Map<DriverRemovalReason, string>([
  [DriverRemovalReason.FIRED_FROM_FLEET, 'Common.Enum.DriverRemovalReason.FiredFromFleet'],
  [DriverRemovalReason.BREAKING_COOPERATION_RULES, 'Common.Enum.DriverRemovalReason.BreakingCooperationRules'],
  [DriverRemovalReason.BREAKING_TRAFFIC_RULES, 'Common.Enum.DriverRemovalReason.BreakingTrafficRules'],
  [DriverRemovalReason.CAR_ACCIDENT, 'Common.Enum.DriverRemovalReason.CarAccident'],
  [DriverRemovalReason.OTHER, 'Common.Enum.DriverRemovalReason.Other'],
]);
