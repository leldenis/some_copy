import { PhotosEntity } from '@api/common/entities/photos.entitiy';
import { TicketActivityLogItemEntity } from '@api/controllers/tickets/entities/ticket-activity-log-item.entity';
import { TicketCommentEntity } from '@api/controllers/tickets/entities/ticket-comment.entity';
import { DriverPhotosCategory, TicketStatus } from '@constant';
import {
  DriverPhotoControlTicketDto,
  TicketInitiatorDataDto,
  PhotoType,
  PictureUrlDto,
  TicketActivityLogItemDto,
  TicketCommentDto,
} from '@data-access';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class DriverPhotoControlTicketEntity implements DriverPhotoControlTicketDto {
  @ApiProperty({ type: String })
  public id: string;

  @ApiProperty({ type: String })
  public driver_id: string;

  @ApiPropertyOptional({ type: Number })
  public deadline_to_send?: number;

  @ApiPropertyOptional({ type: Boolean })
  public block_immediately?: boolean;

  @ApiProperty({ enum: DriverPhotosCategory, enumName: 'DriverPhotosCategory', isArray: true })
  public picture_types: DriverPhotosCategory[];

  @ApiProperty({ type: TicketActivityLogItemEntity, isArray: true })
  public activity_log: TicketActivityLogItemDto[];

  @ApiProperty({ type: TicketCommentEntity, isArray: true })
  public comments: TicketCommentDto[];

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

  @ApiProperty({ type: PhotosEntity })
  public images: Record<PhotoType, PictureUrlDto>;
}
