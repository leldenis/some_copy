import { TicketStatus } from '@constant';
import { FleetDriverRegistrationTicketDto, TicketOrigin } from '@data-access';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class FleetDriverRegistrationTicketEntity implements FleetDriverRegistrationTicketDto {
  @ApiProperty({ type: String })
  public id: string;

  @ApiProperty({ type: String })
  public first_name: string;

  @ApiProperty({ type: String })
  public last_name: string;

  @ApiProperty({ type: String })
  public phone: string;

  @ApiProperty({ type: String })
  public created_at: number;

  @ApiProperty({ enum: TicketStatus, enumName: 'TicketStatus' })
  public status: TicketStatus;

  @ApiPropertyOptional({ enum: TicketOrigin, enumName: 'TicketOrigin' })
  public origin?: TicketOrigin;
}
