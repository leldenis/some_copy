import { Restriction, RestrictionReason } from '@constant';

import { AppUserSnapshotDto, LinkedEntityDto } from '../drivers';
import { UID } from '../utils';

export type CourierRestriction = Partial<Restriction>;

export interface CourierRestrictionTypePayloadDto {
  restrictionType: CourierRestriction;
}

export interface CourierRestrictionDto {
  type: CourierRestriction;
  restricted_by: RestrictionReason;
  fleet_id: UID;
  fleet_name: string;
  actual_from: number;
  actual_till: number;
  created_at: number;
  linked_entity?: LinkedEntityDto;
  created_by: AppUserSnapshotDto;
  is_archived?: boolean;
}

export interface CourierRestrictionListDto {
  items: CourierRestrictionDto[];
  current_fleet_id: UID;
}

export interface CourierRestrictionUpdateDto {
  type: CourierRestriction;
  actual_from?: number;
  actual_till?: number;
}

export interface CourierRestrictionRemoveDto {
  type: CourierRestriction;
}
