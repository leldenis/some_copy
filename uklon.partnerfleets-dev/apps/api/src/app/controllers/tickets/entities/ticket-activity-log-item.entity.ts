import { TicketStatus } from '@constant';
import { ActivityLogClarificationDetailsDto, TicketActivityLogItemDto } from '@data-access';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class ActivityLogClarificationDetailsEntity implements ActivityLogClarificationDetailsDto {
  @ApiPropertyOptional({ type: String })
  public comment?: string;
}

export class TicketActivityLogItemEntity
  extends ActivityLogClarificationDetailsEntity
  implements TicketActivityLogItemDto
{
  @ApiProperty({ enum: TicketStatus, enumName: 'TicketStatus' })
  public status: TicketStatus;

  @ApiProperty({ type: Number })
  public actual_from: number;

  @ApiProperty({ type: String })
  public transferred_by_account_id: string;

  @ApiProperty({ type: String })
  public transferred_by_full_name: string;

  @ApiProperty({ type: String })
  public comment: string;
}
