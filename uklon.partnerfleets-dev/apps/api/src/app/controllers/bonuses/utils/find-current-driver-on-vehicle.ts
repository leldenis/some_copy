import { FleetWithArchivedDriversBasicInfoDto, VehicleBasicInfoDto } from '@data-access';

export const findCurrentDriverOnVehicle = (
  vehicle_id: string,
  vehicles: Map<string, VehicleBasicInfoDto>,
  selectedDriverId: string,
  driversMap: Map<string, FleetWithArchivedDriversBasicInfoDto>,
): FleetWithArchivedDriversBasicInfoDto | null => {
  const foundVehicle = vehicles.get(vehicle_id);

  if (foundVehicle && foundVehicle.selected_by_driver_id === selectedDriverId && driversMap.has(selectedDriverId)) {
    return driversMap.get(selectedDriverId);
  }

  return null;
};
