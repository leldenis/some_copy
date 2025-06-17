import { TicketStatus } from '@constant';
import { VehicleBrandingPeriodDto } from '@data-access';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class VehicleBrandingPeriodEntity implements VehicleBrandingPeriodDto {
  @ApiProperty({ type: String })
  public ticket_id: string;

  @ApiPropertyOptional({ type: Number })
  public deadline_to_send?: number;

  @ApiProperty({ enum: TicketStatus, enumName: 'TicketStatus' })
  public status: TicketStatus;

  @ApiPropertyOptional({ type: String })
  public reject_or_clarification_reason?: string;
}
