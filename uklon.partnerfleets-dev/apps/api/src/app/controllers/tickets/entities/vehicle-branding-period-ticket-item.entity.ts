import { TicketStatus } from '@constant';
import { VehicleBrandingPeriodTicketItemDto } from '@data-access';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class VehicleBrandingPeriodTicketItemEntity implements VehicleBrandingPeriodTicketItemDto {
  @ApiProperty({ type: String })
  public id: string;

  @ApiProperty({ enum: TicketStatus, enumName: 'TicketStatus' })
  public status: TicketStatus;

  @ApiProperty({ type: Number })
  public created_at: number;

  @ApiProperty({ type: String })
  public vehicle_id: string;

  @ApiPropertyOptional({ type: Number })
  public deadline_to_send?: number;

  @ApiPropertyOptional({ type: String })
  public monthly_code?: string;

  @ApiPropertyOptional({ type: String })
  public model_id?: string;

  @ApiPropertyOptional({ type: String })
  public model?: string;

  @ApiPropertyOptional({ type: String })
  public make_id?: string;

  @ApiPropertyOptional({ type: String })
  public make?: string;

  @ApiPropertyOptional({ type: Number })
  public production_year?: number;

  @ApiPropertyOptional({ type: String })
  public license_plate?: string;

  @ApiProperty({ type: String })
  public color: string;

  @ApiPropertyOptional({ type: String })
  public reject_or_clarification_reason?: string;
}
