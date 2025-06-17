import { DriverSelectedVehicleDto } from '@data-access';
import { ApiProperty } from '@nestjs/swagger';

export class DriverSelectedVehicleEntity implements DriverSelectedVehicleDto {
  @ApiProperty({ type: String })
  public vehicle_id: string;

  @ApiProperty({ type: String })
  public license_plate: string;

  @ApiProperty({ type: String })
  public fleet_id: string;

  @ApiProperty({ type: String })
  public make: string;

  @ApiProperty({ type: String })
  public model: string;
}
