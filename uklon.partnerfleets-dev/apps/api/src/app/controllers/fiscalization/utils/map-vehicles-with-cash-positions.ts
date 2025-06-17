import {
  FleetCashierPosDto,
  FleetCashPointVehicleDto,
  FleetVehicleDto,
  FleetVehicleWithFiscalizationDto,
} from '@data-access';

export const getCashierPositionById = (
  cashPointsWithStatus: FleetCashierPosDto[],
  vehicleId: string,
): FleetCashierPosDto =>
  cashPointsWithStatus?.find((pos) => pos.vehicles.some((v: FleetCashPointVehicleDto) => v?.id === vehicleId));

export const mapVehiclesWithCashPositions = (
  cashPointsWithStatus: FleetCashierPosDto[],
  vehicles: FleetVehicleDto[],
): FleetVehicleWithFiscalizationDto[] =>
  vehicles?.map((vehicle) => {
    const cashierPos: FleetCashierPosDto = getCashierPositionById(cashPointsWithStatus, vehicle.id);
    return cashierPos ? { vehicle, cashierPos } : { vehicle, cashierPos: null };
  });
