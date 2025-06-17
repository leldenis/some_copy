import { FleetCashierDto } from './fleet-cashier.dto';
import { FiscalizationStatusValue } from './fleet-fiscalization-settings.dto';

export interface FleetUploadSignatureKeysDto {
  password: string;
  display_name: string;
}

export interface FleetSignatureKeyIdDto {
  key_id: string;
}

export interface FleetSignatureKeyDto<T = boolean> extends FleetSignatureKeyIdDto {
  fleet_id: string;
  created_at: number;
  updated_at: number;
  display_name?: string;
  drfo?: string;
  expiration_date?: number;
  initiated_by?: string;
  public_key?: string;
  serial?: string;
  status?: T;
  cashier?: FleetCashierDto;
}
export type FleetSignatureKeysCollection = FleetSignatureKeyDto[];

export type GatewayFleetSignatureKeyDto = FleetSignatureKeyDto<FiscalizationStatusValue>;
export type GatewayFleetSignatureKeyCollection = GatewayFleetSignatureKeyDto[];
