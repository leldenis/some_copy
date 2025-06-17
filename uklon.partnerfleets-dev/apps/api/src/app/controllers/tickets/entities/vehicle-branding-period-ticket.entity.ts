import { VideosEntity } from '@api/common/entities';
import { TicketActivityLogItemEntity } from '@api/controllers/tickets/entities/ticket-activity-log-item.entity';
import { TicketCommentEntity } from '@api/controllers/tickets/entities/ticket-comment.entity';
import { TicketInitiatorDataEntity } from '@api/controllers/tickets/entities/ticket-initiator-data.entity';
import { TicketStatus, TicketType } from '@constant';
import {
  TicketActivityLogItemDto,
  TicketCommentDto,
  TicketInitiatorDataDto,
  VehicleBrandingPeriodTicketDto,
  VideosDto,
} from '@data-access';
import { ApiProperty } from '@nestjs/swagger';

import { Region } from '@uklon/types';

export class VehicleBrandingPeriodTicketEntity implements VehicleBrandingPeriodTicketDto {
  @ApiProperty({ type: String, name: 'fleet_id' })
  public fleet: string;

  @ApiProperty({ type: String, name: 'vehicle_id' })
  public vehicle: string;

  @ApiProperty({ type: Number })
  public branding_starts_at: number;

  @ApiProperty({ type: Number })
  public branding_ends_at: number;

  @ApiProperty({ type: Boolean })
  public car_body_checked: boolean;

  @ApiProperty({ type: Number })
  public deadline_to_send: number;

  @ApiProperty({ type: Boolean })
  public logo_checked: boolean;

  @ApiProperty({ type: Boolean })
  public vin_number_checked: boolean;

  @ApiProperty({ type: Boolean })
  public month_code_checked: boolean;

  @ApiProperty({ type: String })
  public comment: string;

  @ApiProperty({ type: Number })
  public min_branding_starts_at: number;

  @ApiProperty({ type: Number })
  public max_branding_ends_at: number;

  @ApiProperty({ type: String })
  public processing_status: string;

  @ApiProperty({ type: Number })
  public local_offset_in_minutes_starts_at: number;

  @ApiProperty({ type: Number })
  public local_offset_in_minutes_ends_at: number;

  @ApiProperty({ type: String })
  public monthly_code: string;

  @ApiProperty({ type: VideosEntity })
  public videos: VideosDto;

  @ApiProperty({ type: String })
  public id: string;

  @ApiProperty({ enum: TicketType, enumName: 'TicketType' })
  public type: TicketType;

  @ApiProperty({ type: TicketActivityLogItemEntity, isArray: true })
  public activity_log: TicketActivityLogItemDto[];

  @ApiProperty({ type: TicketCommentEntity, isArray: true })
  public comments: TicketCommentDto[];

  @ApiProperty({ type: String })
  public initiator: string;

  @ApiProperty({ type: TicketInitiatorDataEntity })
  public initiator_data: TicketInitiatorDataDto;

  @ApiProperty({ enum: Region, enumName: 'Region' })
  public region_id: Region;

  @ApiProperty({ type: Boolean })
  public can_be_edited: boolean;

  @ApiProperty({ enum: TicketStatus, enumName: 'TicketStatus' })
  public status: TicketStatus;

  @ApiProperty({ type: String })
  public reviewer_id: string;
}
