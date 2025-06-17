import { NotificationDetailsDto, NotificationType, NotificationTypeValue } from '@data-access';
import { ApiProperty } from '@nestjs/swagger';

export class NotificationDetailsEntity implements NotificationDetailsDto {
  @ApiProperty({ type: String })
  public details: string;

  @ApiProperty({ type: String })
  public id: string;

  @ApiProperty({ type: String })
  public image_base_64: string;

  @ApiProperty({ type: String })
  public message: string;

  @ApiProperty({ enum: NotificationTypeValue, enumName: 'NotificationTypeValue' })
  public type: NotificationType;

  @ApiProperty({ type: Number })
  public accepted_at: number;
}
