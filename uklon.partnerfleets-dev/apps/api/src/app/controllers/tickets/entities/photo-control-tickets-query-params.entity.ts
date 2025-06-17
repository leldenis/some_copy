import { TicketStatus } from '@constant';
import { VehiclePhotoControlTicketsQueryParamsDto } from '@data-access';
import { ApiProperty } from '@nestjs/swagger';

export class VehiclePhotoControlTicketsQueryParamsEntity implements VehiclePhotoControlTicketsQueryParamsDto {
  @ApiProperty({ type: String })
  public licensePlate: string;

  @ApiProperty({ enum: TicketStatus, enumName: 'TicketStatus', isArray: true })
  public status: TicketStatus[];

  @ApiProperty({ type: Number })
  public cursor: number;

  @ApiProperty({ type: Number })
  public limit: number;

  @ApiProperty({ type: Number })
  public from: number;

  @ApiProperty({ type: Number })
  public to: number;
}
