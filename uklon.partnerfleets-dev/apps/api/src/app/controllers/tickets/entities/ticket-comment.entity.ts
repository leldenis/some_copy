import { TicketCommentDto } from '@data-access';
import { ApiProperty } from '@nestjs/swagger';

export class TicketCommentEntity implements TicketCommentDto {
  @ApiProperty({ type: String })
  public comment: string;

  @ApiProperty({ type: Number })
  public created_at: number;

  @ApiProperty({ type: String })
  public full_name: string;

  @ApiProperty({ type: String })
  public email: string;
}
