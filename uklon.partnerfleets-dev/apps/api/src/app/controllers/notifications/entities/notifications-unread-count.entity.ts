import { NotificationsUnreadCountDto } from '@data-access';
import { ApiProperty } from '@nestjs/swagger';

export class NotificationsUnreadCountEntity implements NotificationsUnreadCountDto {
  @ApiProperty({ type: Number })
  public unread_count: number;
}
