import { DriverPhotoControlCreatingReason, DriverPhotosCategory, TicketStatus } from '@constant';

import { BlockedListStatusDto } from '../blocked-list';
import { CollectionCursorDto } from '../collection-cursor.dto';
import { CursorQueryDto, DateRangeQuery } from '../common';
import { PhotoType } from '../photos.dto';
import { PictureUrlDto } from '../picture-url-dto.interface';
import { TicketActivityLogItemDto } from '../tickets/ticket-activity-log-item.dto';
import { TicketCommentDto } from '../tickets/ticket-comment.dto';
import { TicketInitiatorDataDto } from '../tickets/ticket-initiator.dto';

export interface DriverPhotoControlReasonsDto {
  reasons?: DriverPhotoControlCreatingReason[];
  reason_comment?: string;
}

export interface DriverPhotoControlTicketItemDto extends DriverPhotoControlReasonsDto {
  id: string;
  status: TicketStatus;
  created_at: number;
  picture_types: PhotoType[];
  driver_id: string;
  deadline_to_send: number;
  driver_status: BlockedListStatusDto;
  phone?: string;
  first_name?: string;
  last_name?: string;
  signal?: string;
}

export type DriverPhotoControlTicketsCollection = CollectionCursorDto<DriverPhotoControlTicketItemDto>;

export interface DriverPhotoControlQueryParamsDto extends CursorQueryDto, DateRangeQuery {
  status: TicketStatus;
  phone: string;
}

export interface DriverPhotoControlTicketDto extends DriverPhotoControlReasonsDto {
  id: string;
  driver_id: string;
  deadline_to_send?: number;
  block_immediately?: boolean;
  picture_types: DriverPhotosCategory[];
  activity_log: TicketActivityLogItemDto[];
  comments: TicketCommentDto[];
  initiator_data: TicketInitiatorDataDto;
  region_id: number;
  can_be_edited: boolean;
  status: TicketStatus;
  reviewer_id: string;
  images: Record<PhotoType, PictureUrlDto>;
}
