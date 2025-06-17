import { DriverPhotoControlCreatingReason, TicketStatus } from '@constant';
import { DriverDetailsPhotoControlDto } from '@data-access';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class DriverPhotoControlEntity implements DriverDetailsPhotoControlDto {
  @ApiProperty({ type: String })
  public ticket_id: string;

  @ApiPropertyOptional({ type: Number })
  public deadline_to_send?: number;

  @ApiPropertyOptional({ type: Boolean })
  public block_immediately?: boolean;

  @ApiPropertyOptional({ enum: TicketStatus, enumName: 'TicketStatus' })
  public status?: TicketStatus;

  @ApiPropertyOptional({
    enum: DriverPhotoControlCreatingReason,
    enumName: 'DriverPhotoControlCreatingReason',
    isArray: true,
  })
  public reasons?: DriverPhotoControlCreatingReason[];

  @ApiPropertyOptional({ type: String })
  public reason_comment?: string;
}
