import { FleetVehicleOption, TicketDto } from '@data-access';
import { ApiProperty } from '@nestjs/swagger';

export class TicketEntity implements TicketDto {
  @ApiProperty({ type: String })
  public tiket_id: string;
}

export class TicketVehicleOptionsEntity {
  @ApiProperty({ enum: FleetVehicleOption, isArray: true })
  public options: FleetVehicleOption[];
}
