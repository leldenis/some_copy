import { FleetVehicleDriverDto, GatewayFleetVehicleDriverDto } from '@data-access';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';

export class FleetVehicleDriverEntity implements FleetVehicleDriverDto {
  @Expose()
  @Type(() => String)
  @ApiProperty({ type: String })
  public get id(): string {
    return this.driver.driver_id;
  }

  @Expose()
  @Type(() => String)
  @ApiProperty({ type: String })
  public get fullName(): string {
    return `${this.driver.last_name} ${this.driver.first_name}`;
  }

  @Exclude()
  private readonly driver: GatewayFleetVehicleDriverDto;

  constructor(driver: GatewayFleetVehicleDriverDto) {
    this.driver = driver;
  }
}
