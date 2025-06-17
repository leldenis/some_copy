import { TicketStatus, TicketType, VehiclePhotosCategory } from '@constant';

import { BlockedListStatusDto } from '../blocked-list/blocked-list.dto';
import { CursorQueryDto, DateRangeDto, DateRangeQuery } from '../common';
import { FleetVehicleOption } from '../fleet-vehicle';
import { PhotoType } from '../photos.dto';
import { PictureUrlDto } from '../picture-url-dto.interface';

import { TicketActivityLogItemDto } from './ticket-activity-log-item.dto';
import { TicketCommentDto } from './ticket-comment.dto';
import { TicketInitiatorDataDto } from './ticket-initiator.dto';
import { VehiclePhotoControlCreatingReasonsDto } from './vehicle-photo-control-creation-reason.dto';

export interface VehiclePhotoControlListQueryParamsDto {
  cursor: number;
  limit: number;
  licensePlate: string;
  status: TicketStatus | '';
  period: DateRangeDto;
}

export interface VehiclePhotoControlTicketsQueryParamsDto extends CursorQueryDto, DateRangeQuery {
  licensePlate: string;
  status: TicketStatus | TicketStatus[];
}

export interface VehiclePhotoControlTicketDto extends VehiclePhotoControlCreatingReasonsDto {
  id: string;
  type: TicketType;
  vehicle_id: string;
  images: Record<PhotoType, PictureUrlDto>;
  activity_log: TicketActivityLogItemDto[];
  comments: TicketCommentDto[];
  initiator: string;
  initiator_data: TicketInitiatorDataDto;
  region_id: number;
  can_be_edited: boolean;
  status: TicketStatus;
  reviewer_id: string;
  license_plate: string;
  picture_types: VehiclePhotosCategory[];
  deadline_to_send?: number;
  block_immediately?: boolean;
  options?: FleetVehicleOption[];
}

export interface VehiclePhotoControlTicketItemDto extends VehiclePhotoControlCreatingReasonsDto {
  id: string;
  status: TicketStatus;
  created_at: number;
  model_id: string;
  model: string;
  make_id: string;
  make: string;
  production_year: number;
  license_plate: string;
  color: string;
  deadline_to_send: number;
  picture_types: PhotoType[];
  vehicle_status: BlockedListStatusDto;
  vehicle_id?: string;
}
