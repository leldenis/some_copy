import { TicketInitiatorDataDto } from '@data-access';
import { ApiProperty } from '@nestjs/swagger';

export class TicketInitiatorDataEntity implements TicketInitiatorDataDto {
  @ApiProperty({ type: String })
  public type: string;

  @ApiProperty({ type: String })
  public first_name: string;

  @ApiProperty({ type: String })
  public last_name: string;
}
