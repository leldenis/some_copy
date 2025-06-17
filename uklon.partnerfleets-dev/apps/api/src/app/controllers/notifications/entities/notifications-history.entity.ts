import { NotificationItemDto, NotificationImportance, NotificationType, NotificationTypeValue } from '@data-access';
import { ApiProperty } from '@nestjs/swagger';

export class NotificationItemEntity implements NotificationItemDto {
  @ApiProperty({ type: String })
  public id: string;

  @ApiProperty({ type: Number })
  public sent_at: number;

  @ApiProperty({ type: Boolean })
  public is_read: boolean;

  @ApiProperty({ enum: NotificationTypeValue, enumName: 'NotificationTypeValue' })
  public type: NotificationType;

  @ApiProperty({ type: String })
  public importance: NotificationImportance;

  @ApiProperty({ type: String })
  public message: string;

  @ApiProperty({ type: Number })
  public accepted_at: number;

  @ApiProperty({ type: String })
  public fleet_id: string;

  @ApiProperty({ type: Boolean })
  public is_acceptance_required: boolean;

  @ApiProperty({ type: Boolean })
  public is_bulk: boolean;
}
