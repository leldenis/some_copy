import { VehicleRemovalReason } from '@constant';

export const VEHICLE_REMOVAL_REASON_INTL = new Map<VehicleRemovalReason, string>([
  [VehicleRemovalReason.MIS_REGISTRATION, 'Common.Enum.VehicleRemovalReason.MisRegistration'],
  [VehicleRemovalReason.CAR_CONDITION, 'Common.Enum.VehicleRemovalReason.CarCondition'],
  [VehicleRemovalReason.CAR_SOLD, 'Common.Enum.VehicleRemovalReason.CarSold'],
  [VehicleRemovalReason.CAR_ACCIDENT, 'Common.Enum.VehicleRemovalReason.CarAccident'],
  [VehicleRemovalReason.OTHER, 'Common.Enum.VehicleRemovalReason.Other'],
]);
