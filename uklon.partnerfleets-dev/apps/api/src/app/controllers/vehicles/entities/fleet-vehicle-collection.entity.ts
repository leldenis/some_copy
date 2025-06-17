import { FleetVehicleCollectionDto, FleetVehicleDto, GatewayFleetVehicleDto } from '@data-access';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';

import { FleetVehicleEntity } from './fleet-vehicle.entity';

export class FleetVehicleCollectionEntity implements FleetVehicleCollectionDto {
  @Exclude()
  private readonly fleetVehicles: GatewayFleetVehicleDto[];

  @Exclude()
  private readonly totalCount: number;

  @Expose()
  @Type(() => FleetVehicleEntity)
  @ApiProperty({ type: FleetVehicleEntity, isArray: true })
  public get data(): FleetVehicleDto[] {
    return this.fleetVehicles.map((vehicle) => new FleetVehicleEntity(vehicle));
  }

  @Expose()
  @Type(() => Number)
  @ApiProperty({ type: Number })
  public get total(): number {
    return this.totalCount;
  }

  constructor(vehicles: GatewayFleetVehicleDto[], total: number) {
    this.fleetVehicles = vehicles;
    this.totalCount = total;
  }
}
