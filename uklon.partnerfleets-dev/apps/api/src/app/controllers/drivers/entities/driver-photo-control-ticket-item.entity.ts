import { DriverBlockListStatusEntity } from '@api/controllers/drivers/entities/driver-block-list-status-entity';
import { DriverPhotoControlCreatingReason, TicketStatus } from '@constant';
import { BlockedListStatusDto, DriverPhotoControlTicketItemDto, PhotoType } from '@data-access';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class DriverPhotoControlTicketItemEntity implements DriverPhotoControlTicketItemDto {
  @ApiProperty({ type: String })
  public id: string;

  @ApiProperty({ enum: TicketStatus, enumName: 'TicketStatus' })
  public status: TicketStatus;

  @ApiProperty({ type: Number })
  public created_at: number;

  @ApiProperty({ type: String, isArray: true })
  public picture_types: PhotoType[];

  @ApiProperty({ type: String })
  public driver_id: string;

  @ApiProperty({ type: Number })
  public deadline_to_send: number;

  @ApiProperty({ type: DriverBlockListStatusEntity })
  public driver_status: BlockedListStatusDto;

  @ApiPropertyOptional({ type: String })
  public phone?: string;

  @ApiPropertyOptional({ type: String })
  public first_name?: string;

  @ApiPropertyOptional({ type: String })
  public last_name?: string;

  @ApiPropertyOptional({ type: String })
  public signal?: string;

  @ApiPropertyOptional({
    enum: DriverPhotoControlCreatingReason,
    enumName: 'DriverPhotoControlCreatingReason',
    isArray: true,
  })
  public reasons?: DriverPhotoControlCreatingReason[];

  @ApiPropertyOptional({ type: String })
  public reason_comment?: string;
}
