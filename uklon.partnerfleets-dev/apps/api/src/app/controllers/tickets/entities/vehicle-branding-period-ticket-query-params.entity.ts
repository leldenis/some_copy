import { TicketStatus } from '@constant';
import { VehicleBrandingPeriodTicketQueryParamsDto } from '@data-access';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class VehicleBrandingPeriodTicketQueryParamsEntity implements VehicleBrandingPeriodTicketQueryParamsDto {
  @ApiPropertyOptional({ enum: TicketStatus, isArray: true })
  public status?: TicketStatus[];

  @ApiPropertyOptional({ type: String })
  public license_plate?: string;

  @ApiProperty({ type: Number })
  public cursor: number;

  @ApiProperty({ type: Number })
  public limit: number;

  @ApiProperty({ type: Number })
  public from: number;

  @ApiProperty({ type: Number })
  public to: number;
}
