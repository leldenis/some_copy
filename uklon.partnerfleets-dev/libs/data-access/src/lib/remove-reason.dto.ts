import { DriverRemovalReason, VehicleRemovalReason } from '@constant';

export interface RemoveReasonDto {
  reason: DriverRemovalReason | VehicleRemovalReason;
  comment: string;
}

export interface RemoveCashLimitRestrictionWithResetDto {
  with_reset_limit: boolean;
}
