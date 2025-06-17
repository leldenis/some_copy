import { FleetVehicleComfortLevel } from '@constant';
import { FleetVehicleDriverType, FleetVehicleUklonDto, GatewayFleetVehicleDto } from '@data-access';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';

export class FleetVehicleUklonEntity implements FleetVehicleUklonDto {
  @Expose()
  @Type(() => String)
  @ApiProperty({ enum: FleetVehicleDriverType, enumName: 'FleetVehicleDriverType' })
  public get accessibleFor(): FleetVehicleDriverType {
    return this.vehicle.access_to_drivers_type as FleetVehicleDriverType;
  }

  @Expose()
  @Type(() => Number)
  @ApiProperty({ type: Number })
  public get addedAt(): number {
    return this.vehicle.added_to_fleet;
  }

  @Expose()
  @Type(() => String)
  @ApiProperty({ enum: FleetVehicleComfortLevel, enumName: 'FleetVehicleComfortLevel' })
  public get comfortLevel(): FleetVehicleComfortLevel {
    return this.vehicle.comfort_level as FleetVehicleComfortLevel;
  }

  @Expose()
  @Type(() => Boolean)
  @ApiProperty({ type: Boolean })
  public get hasBranding(): boolean {
    return this.vehicle.is_branded;
  }

  @Expose()
  @Type(() => Boolean)
  @ApiProperty({ type: Boolean })
  public get hasPriority(): boolean {
    return this.vehicle.has_dispatching_priority;
  }

  @Exclude()
  private readonly vehicle: GatewayFleetVehicleDto;

  constructor(vehicle: GatewayFleetVehicleDto) {
    this.vehicle = vehicle;
  }
}
