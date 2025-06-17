import { DataCollectionDto, TotalDto } from '../common';
import { FleetVehicleDto } from '../fleet-vehicle';

export interface FleetCashierDto {
  cashier_id: string;
  cashier_created_at: number;
  points_of_sale?: FleetCashPointDto[];
}

export interface FleetCashPointVehicleDto {
  id: string;
}

export interface FleetCashPointDto {
  id: string;
  organization_name?: string;
  name?: string;
  fiscal_number: number;
  vehicles?: FleetCashPointVehicleDto[];
}

export interface FleetVehiclePointOfSaleDto {
  point_of_sale_id: string;
}

export type FleetCashPointCollection = FleetCashPointDto[];

export interface GatewayFleetCashPointDto {
  org_name: string;
  name: string;
  fiscal_number: number;
}

export type GatewayFleetCashPointCollection = GatewayFleetCashPointDto[];

export enum FleetCashPointStatus {
  OPEN = 'open',
  CLOSED = 'closed',
}

export interface FleetCashPointStatusDto {
  status: FleetCashPointStatus;
}

export interface FleetCashierPosDto {
  status: FleetCashPointStatus;
  id: string;
  organization_name?: string;
  name?: string;
  fiscal_number: number;
  vehicles?: FleetCashPointVehicleDto[];
}

export interface FleetVehicleWithFiscalizationDto {
  vehicle: FleetVehicleDto;
  cashierPos?: FleetCashierPosDto;
}

interface UnlinkCashPointSelectedVehicleDto {
  id: string;
  name: string;
}

export interface FleetVehicleWithFiscalizationUnlinkDto {
  vehicle: UnlinkCashPointSelectedVehicleDto;
  cashierPos?: FleetCashierPosDto;
}

export interface FleetVehicleFiscalizationCollectionDto
  extends DataCollectionDto<FleetVehicleWithFiscalizationDto>,
    TotalDto {}

export interface FleetVehicleCashierPosDto extends FleetCashierPosDto {
  fiscalStatus: boolean;
}
