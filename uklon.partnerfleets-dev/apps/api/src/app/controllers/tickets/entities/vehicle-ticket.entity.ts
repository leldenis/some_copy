import { PhotosEntity } from '@api/common/entities/photos.entitiy';
import { TicketStatus, TicketType, VehiclePhotosCategory } from '@constant';
import {
  TicketInitiatorDataDto,
  PhotoType,
  PictureUrlDto,
  TicketActivityLogItemDto,
  TicketCommentDto,
  VehicleDetailsPhotoControlDto,
  VehiclePhotoControlTicketDto,
  VehicleTicketDto,
  FleetVehicleOption,
} from '@data-access';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { TicketActivityLogItemEntity } from './ticket-activity-log-item.entity';
import { TicketCommentEntity } from './ticket-comment.entity';

export class VehicleTicketEntity implements VehicleTicketDto {
  @ApiProperty({ type: String })
  public model_id: string;

  @ApiProperty({ type: String })
  public model: string;

  @ApiProperty({ type: String })
  public make_id: string;

  @ApiProperty({ type: String })
  public make: string;

  @ApiProperty({ type: Number })
  public production_year: number;

  @ApiProperty({ type: String })
  public license_plate: string;

  @ApiProperty({ type: String })
  public id: string;

  @ApiProperty({ enum: TicketType, enumName: 'TicketType' })
  public type: TicketType;

  @ApiProperty({ enum: TicketStatus, enumName: 'TicketStatus' })
  public status: TicketStatus;

  @ApiProperty({ type: Number })
  public created_at: number;
}

export class VehiclePhotoControlTicketEntity implements VehiclePhotoControlTicketDto {
  @ApiProperty({ type: String })
  public id: string;

  @ApiProperty({ enum: TicketType, enumName: 'TicketType' })
  public type: TicketType;

  @ApiProperty({ type: String })
  public vehicle_id: string;

  @ApiProperty({ type: Number })
  public deadline_to_send: number;

  @ApiProperty({ type: PhotosEntity })
  public images: Record<PhotoType, PictureUrlDto>;

  @ApiProperty({ type: TicketActivityLogItemEntity, isArray: true })
  public activity_log: TicketActivityLogItemDto[];

  @ApiProperty({ type: TicketCommentEntity, isArray: true })
  public comments: TicketCommentDto[];

  @ApiProperty({ type: String })
  public initiator: string;

  @ApiProperty({ type: Object })
  public initiator_data: TicketInitiatorDataDto;

  @ApiProperty({ type: Number })
  public region_id: number;

  @ApiProperty({ type: Boolean })
  public can_be_edited: boolean;

  @ApiProperty({ enum: TicketStatus, enumName: 'TicketStatus' })
  public status: TicketStatus;

  @ApiProperty({ type: String })
  public reviewer_id: string;

  @ApiProperty({ type: String })
  public license_plate: string;

  @ApiProperty({ enum: VehiclePhotosCategory, enumName: 'VehiclePhotosCategory', isArray: true })
  public picture_types: VehiclePhotosCategory[];

  @ApiPropertyOptional({ type: Boolean })
  public block_immediately?: boolean;

  @ApiPropertyOptional({ enum: FleetVehicleOption, isArray: true })
  public options?: FleetVehicleOption[];
}

export class VehicleDetailsPhotoControlEntity implements VehicleDetailsPhotoControlDto {
  @ApiProperty({ type: Number })
  public deadline_to_send: number;

  @ApiProperty({ enum: TicketStatus, enumName: 'TicketStatus' })
  public status: TicketStatus;

  @ApiProperty({ type: String })
  public ticket_id: string;

  @ApiPropertyOptional({ type: Boolean })
  public block_immediately?: boolean;
}
