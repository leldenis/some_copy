import { FleetContactDto } from '../contacts/fleet-contact.dto';

import { FleetRole } from './fleet-role';
import { Currency } from '@uklon/types';

export enum FleetType {
  COMMERCIAL = 'Commercial',
  PRIVATE = 'Private',
  RENTAL = 'Rental',
  COURIER_FINANCE_MEDIATOR = 'CourierFinanceMediator',
  PRIVATE_COURIER = 'PrivateCourier',
}

export enum FleetStatus {
  ACTIVE = 'Active',
  TURNED_OFF = 'TurnedOff',
}

export interface FleetDto {
  id: string;
  name: string;
  region_id: number;
  role: FleetRole;
  email: string;
  fleet_type: FleetType;
  tin_refused: boolean;
  is_fiscalization_enabled?: boolean;
  wallet_transfers_allowed?: boolean;
}

export interface FleetDataDto {
  id: string;
  region_id: number;
  currency: Currency;
}

export interface FleetMaintainerDto {
  absent_from?: number;
  absent_to?: number;
  id: string;
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  telegram_phone?: string;
  viber_phone?: string;
  reserve?: boolean;
}

export interface FleetDetailsDto {
  users: FleetContactDto[];
  wallet_id: string;
  id: string;
  region_id: number;
  name: string;
  created_at: number;
  email: string;
  driver_count: number;
  employee_count: number;
  vehicle_count: number;
  status: FleetStatus;
  type: FleetType;
  is_fiscalization_enabled?: boolean;
  maintainer?: FleetMaintainerDto;
  reserve_maintainer?: FleetMaintainerDto;
}
