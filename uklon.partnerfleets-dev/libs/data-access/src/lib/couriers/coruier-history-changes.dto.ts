import { BlockedListStatusReason, CourierHistoryChange } from '@constant';

import { CollectionCursorDto } from '../collection-cursor.dto';
import { HistoryChangeInitiatorDto } from '../common';

export interface CourierHistoryChangeItemDto {
  id: string;
  change_type: CourierHistoryChange;
  occurred_at: number;
  initiator: HistoryChangeInitiatorDto;
  linked_entities: Record<string, string>;
  has_additional_data: boolean;
  details?: CourierHistoryChangeItemDetailsDto;
}
export type CourierHistoryChangesDto = CollectionCursorDto<CourierHistoryChangeItemDto>;

export interface CourierHistoryChangeItemDetailsDto {
  type?: string;
  added?: string[];
  removed?: string[];
  new_date_of_birth: string;
  old_date_of_birth: string;
  new_first_name: string;
  old_first_name: string;
  new_last_name: string;
  old_last_name: string;
  new_patronymic: string;
  old_patronymic: string;
  new_email: string;
  old_email: string;
  new_sex: string;
  old_sex: string;
  new_locale: string;
  old_locale: string;
  new_id_number: string;
  old_id_number: string;
  new_id: string;
  old_id: string;
  became_available?: string[];
  became_unavailable?: string[];
  old_value: string;
  new_value: string;
  reason?: BlockedListStatusReason;
}

export interface CourierHistoryParamsDto {
  fleetId: string;
  cursor: number;
  limit: number;
  changeType?: string;
}

export type CourierHistoryProfileChangeProps =
  | 'date_of_birth'
  | 'first_name'
  | 'last_name'
  | 'patronymic'
  | 'email'
  | 'sex'
  | 'locale'
  | 'id_number'
  | 'value';
