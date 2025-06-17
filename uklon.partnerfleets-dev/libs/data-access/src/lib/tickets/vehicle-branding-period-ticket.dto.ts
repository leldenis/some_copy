import { TicketStatus } from '@constant';

import { Region } from '@uklon/types';

import { VideosDto } from '../videos.dto';

import { TicketActivityLogItemDto } from './ticket-activity-log-item.dto';
import { TicketCommentDto } from './ticket-comment.dto';
import { TicketInitiatorDataDto } from './ticket-initiator.dto';

export enum VehicleBrandingPeriodTicketClarificationReason {
  INCORRECT_MONTHLY_CODE = 'incorrect_monthly_code',
  VEHICLE_BODY_IS_NOT_COMPLETELY_VISIBLE = 'vehicle_body_is_not_completely_visible',
  MISSED_VIN_CODE = 'missed_vin_code',
  VIDEO_LOW_QUALITY = 'video_low_quality',
  DAMAGES_ARE_NOT_FIXED = 'damages_are_not_fixed',
  DIRTY_VEHICLE = 'dirty_vehicle',
  OTHER = 'other',
}

export interface VehicleBrandingPeriodTicketDto {
  fleet: string;
  vehicle: string;
  branding_starts_at: number;
  branding_ends_at: number;
  car_body_checked: boolean;
  deadline_to_send: number;
  logo_checked: boolean;
  vin_number_checked: boolean;
  month_code_checked: boolean;
  comment: string;
  min_branding_starts_at: number;
  max_branding_ends_at: number;
  processing_status: string;
  local_offset_in_minutes_starts_at: number;
  local_offset_in_minutes_ends_at: number;
  monthly_code: string;
  videos: VideosDto;
  id: string;
  type: string;
  activity_log: TicketActivityLogItemDto[];
  comments: TicketCommentDto[];
  initiator: string;
  initiator_data: TicketInitiatorDataDto;
  region_id: Region;
  can_be_edited: boolean;
  status: TicketStatus;
  reviewer_id: string;
}
