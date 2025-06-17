import { BlockedListStatusReason } from '@constant';

import { CollectionCursorDto } from '../collection-cursor.dto';
import { HistoryChangeInitiatorDto } from '../common';
import { PaymentProvideIdentificationStatusesDto } from '../finance/wallet.dto';

import { DriverPaymentInfoDto } from './driver-payment-details.dto';

export enum DriverHistoryChange {
  KARMA_RESETED = 'KarmaReseted',
  REGISTERED = 'Registered',
  PICTURE_UPLOADED = 'PictureUploaded',
  REMOVED_FROM_FLEET = 'RemovedFromFleet',
  RESTRICTIONS_CHANGED = 'RestrictionsChanged',
  ADDED_TO_FLEET = 'AddedToFleet',
  PHONE_CHANGED = 'PhoneChanged',
  BLACK_LIST_CLEARED = 'BlackListCleared',
  PROFILE_CHANGED = 'ProfileChanged',
  PRODUCT_AVAILABILITY_CHANGED = 'ProductAvailabilityChanged',
  PRODUCT_EDIT_BY_DRIVER_CHANGED = 'ProductEditByDriverChanged',
  PRODUCT_RULES_ACTIVATIONS_CHANGED = 'ProductRulesActivationsChanged',
  PASSWORD_CHANGED = 'PasswordChanged',
  FINANCE_PROFILE_CHANGED = 'FinanceProfileChanged',
  BLOCKED = 'Blocked',
  UNBLOCKED = 'Unblocked',
  B2B_SPLIT_ADJUSTMENT_CHANGED = 'B2BSplitAdjustmentChanged',
  B2B_SPLIT_DISTRIBUTION_CHANGED = 'B2BSplitDistributionChanged',
  INDIVIDUAL_ENTREPRENEUR_CHANGED = 'IndividualEntrepreneurChanged',
  WITHDRAWAL_TYPE_CHANGED = 'WithdrawalTypeChanged',
  PAYMENT_IDENTIFICATION_STATUS_CHANGED = 'PaymentIdentificationStatusChanged',
  PHOTO_CONTROL_CREATION_REJECTED = 'PhotoControlCreationRejected',
  PHOTO_CONTROL_PASSED = 'PhotoControlPassed',
  PHOTO_CONTROL_FAILED = 'PhotoControlFailed',
  CASH_LIMIT = 'CashLimitChanged',
}

export type DriverHistoryProfileChangeProps =
  | 'has_citizenship'
  | 'license'
  | 'date_of_birth'
  | 'license_till'
  | 'disability_types'
  | 'payment_details'
  | 'first_name'
  | 'last_name'
  | 'patronymic'
  | 'email'
  | 'sex'
  | 'locale'
  | 'id_number'
  | 'value';

export interface DriverHistoryChangeItemDto {
  id: string;
  change_type: DriverHistoryChange;
  occurred_at: number;
  initiator: HistoryChangeInitiatorDto;
  linked_entities: Record<string, string>;
  has_additional_data: boolean;
  details?: DriverHistoryChangeItemDetailsDto;
}

export interface DriverHistoryChangeItemDetailsDto {
  type?: string;
  added?: string[];
  removed?: string[];
  became_available?: string[];
  became_unavailable?: string[];
  became_editable_by_driver?: string[];
  became_uneditable_by_driver?: string[];
  new_has_citizenship?: boolean;
  old_has_citizenship?: boolean;
  new_license?: string;
  old_license?: string;
  new_date_of_birth?: string;
  old_date_of_birth?: string;
  new_license_till?: number;
  old_license_till?: number;
  new_disability_types?: string[];
  old_disability_types?: string[];
  new_payment_details?: DriverPaymentInfoDto;
  old_payment_details?: DriverPaymentInfoDto;
  new_first_name?: string;
  old_first_name?: string;
  new_last_name?: string;
  old_last_name?: string;
  new_patronymic?: string;
  old_patronymic?: string;
  new_email?: string;
  old_email?: string;
  new_sex?: string;
  old_sex?: string;
  new_locale?: string;
  old_locale?: string;
  new_id_number?: string;
  old_id_number?: string;
  new_order_payment_to_card?: boolean;
  new_wallet_to_card_transfer?: boolean;
  availability_rules_activations?: AvailabilityRulesActivationDto[];
  editing_availability_rules_activations?: AvailabilityRulesActivationDto[];
  reason?: BlockedListStatusReason;
  withdrawal_type?: string;
  old_value?: string;
  current_value?: string;
  old_name?: string;
  payment_provider_identification_statuses?: PaymentProvideIdentificationStatusesDto[];
  context?: Record<string, unknown>;
}

export type DriverHistoryChangesDto = CollectionCursorDto<DriverHistoryChangeItemDto>;

export interface DriverHistoryParamsDto {
  fleetId: string;
  cursor: number;
  limit: number;
  vehicleId?: string;
  changeType?: string;
}

export interface AvailabilityRulesActivationDto {
  name: string;
  new: Record<string, boolean>;
  old: Record<string, boolean>;
}
