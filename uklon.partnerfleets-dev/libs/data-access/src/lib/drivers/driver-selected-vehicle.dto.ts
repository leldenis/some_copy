export interface DriverSelectedVehicleDto {
  vehicle_id: string;
  license_plate: string;
  fleet_id: string;
  make: string;
  model: string;
  currentFleet?: boolean;
}
