import { FleetType } from '../account/fleet.dto';
import { HistoryChangeInitiatorDto } from '../common';

export enum FleetHistoryType {
  COMMERCIAL_CREATED = 'CommercialCreated',
  REGION_CHANGED = 'RegionChanged',
  PROFILE_CHANGED = 'ProfileChanged',
  OWNER_ADDED = 'OwnerAdded',
  OWNER_DELETED = 'OwnerDeleted',
  MANAGER_ADDED = 'ManagerAdded',
  MANAGER_DELETED = 'ManagerDeleted',
  DRIVER_ADDED = 'DriverAdded',
  DRIVER_REMOVED = 'DriverRemoved',
  VEHICLE_REGISTERED = 'VehicleRegistered',
  VEHICLE_REMOVED = 'VehicleRemoved',
  VEHICLE_ADDED = 'VehicleAdded',
  DRIVER_REGISTERED = 'DriverRegistered',
  WITHDRAWAL_TYPE_CHANGED = 'WithdrawalTypeChanged',
  INDIVIDUAL_ENTREPRENEUR_UPDATED = 'IndividualEntrepreneurUpdated',
  INDIVIDUAL_ENTREPRENEUR_SELECTED = 'IndividualEntrepreneurSelected',
  B2B_SPLIT_ADJUSTMENT_CHANGED = 'B2BSplitAdjustmentChanged',
  B2B_SPLIT_DISTRIBUTION_CHANGED = 'B2BSplitDistributionChanged',
  FISCALIZATION_VAT_TYPE_CHANGED = 'FiscalizationVatTypeChanged',
  FISCALIZATION_FARE_PAYMENT_TYPE = 'FiscalizationFarePaymentType',
  FISCALIZATION_POS_BINDED = 'FiscalizationPosBinded',
  FISCALIZATION_POS_UNBINDED = 'FiscalizationPosUnbinded',
  WALLET_TRANSFERS_ALLOWED_CHANGED = 'WalletTransfersAllowedChanged',
  CASH_LIMIT_CHANGED = 'CashLimitChanged',
}

export type LinkedEntity = 'driver_id' | 'user_id' | 'vehicle_id' | 'ticket';

export interface FleetHistoryFiltersDto {
  changeType: FleetHistoryType | '';
}

export interface FleetHistoryRequestParamsDto {
  limit: number;
  cursor: number;
  changeType: FleetHistoryType | '';
}

export interface FleetHistoryChangeItemDto {
  id: string;
  change_type: FleetHistoryType;
  occurred_at: number;
  initiator: HistoryChangeInitiatorDto;
  linked_entities?: Record<LinkedEntity, unknown>;
  has_additional_data?: boolean;
  details?: Record<string, unknown>;
}

export interface FleetHistoryChangeItemDetailsDto {
  old_name?: string;
  new_name?: string;
  old_email?: string;
  new_email?: string;
  old_tax_number?: string;
  new_tax_number?: string;
  old_fleet_type?: FleetType;
  new_fleet_type?: FleetType;
  old_id?: number;
  new_id?: number;
  old_merchant_id?: string;
  new_merchant_id?: string;
  old_entrepreneur_name?: string;
  new_entrepreneur_name?: string;
  old_payment_providers?: string;
  new_payment_providers?: string;
  old_value?: string | string[];
  new_value?: string | string[];
  current_value?: string;
}

export type FleetHistoryProfileChangeProps =
  | 'name'
  | 'email'
  | 'tax_number'
  | 'fleet_type'
  | 'id'
  | 'merchant_id'
  | 'entrepreneur_name'
  | 'payment_providers'
  | 'value';
