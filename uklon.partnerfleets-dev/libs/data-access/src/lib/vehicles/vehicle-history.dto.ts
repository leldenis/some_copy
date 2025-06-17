import { CollectionCursorDto } from '../collection-cursor.dto';
import { HistoryChangeInitiatorDto } from '../common';

export enum VehicleHistoryType {
  CREATED = 'Created',
  REMOVED_FROM_FLEET = 'RemovedFromFleet',
  ADDED_TO_FLEET = 'AddedToFleet',
  PROFILE_CHANGED = 'ProfileChanged',
  OPTIONS_CHANGED = 'OptionsChanged',
  PRODUCT_AVAILABILITY_CHANGED = 'ProductAvailabilityChanged',
  PICTURE_UPLOADED = 'PictureUploaded',
  ACCESS_TO_VEHICLE_CHANGED = 'AccessToVehicleChanged',
  BLOCKED = 'Blocked',
  UNBLOCKED = 'Unblocked',
  PHOTO_CONTROL_PASSED = 'PhotoControlPassed',
  PHOTO_CONTROL_FAILED = 'PhotoControlFailed',
  PHOTO_CONTROL_TICKET_CREATION_REJECTED = 'PhotoControlTicketCreationRejected',
  RIDE_HAILING_ENABLED_CHANGED = 'RideHailingEnabledChanged',
}

export type VehicleHistoryChangesDto = CollectionCursorDto<VehicleHistoryChangeItemDto>;

export interface VehicleHistoryChangeItemDto {
  id: string;
  change_type: VehicleHistoryType;
  occurred_at: number;
  initiator: HistoryChangeInitiatorDto;
  linked_entities: Record<string, string>;
  has_additional_data: boolean;
  details?: Record<string, unknown>;
}

export interface VehicleHistoryParamsDto {
  fleetId: string;
  cursor: number;
  limit: number;
  vehicleId?: string;
  changeType?: string;
}
