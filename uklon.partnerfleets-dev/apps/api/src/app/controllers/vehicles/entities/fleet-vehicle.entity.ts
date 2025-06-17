import { VehicleDetailsPhotoControlEntity } from '@api/controllers/tickets/entities/vehicle-ticket.entity';
import { VehicleBlockListStatusEntity } from '@api/controllers/vehicles/entities/vehicle-block-list-status-entity';
import { VehicleBrandingPeriodEntity } from '@api/controllers/vehicles/entities/vehicle-branding-period.entity';
import {
  BlockedListStatusDto,
  FleetVehicleDto,
  FleetVehicleAboutDto,
  FleetVehicleDriverDto,
  FleetVehicleUklonDto,
  GatewayFleetVehicleDto,
  VehicleDetailsPhotoControlDto,
  VehicleBrandingPeriodDto,
} from '@data-access';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';

import { FleetVehicleAboutEntity } from './fleet-vehicle-about.entity';
import { FleetVehicleDriverEntity } from './fleet-vehicle-driver.entity';
import { FleetVehicleUklonEntity } from './fleet-vehicle-uklon.entity';

export class FleetVehicleEntity implements FleetVehicleDto {
  @Exclude()
  private readonly fleetVehicle: GatewayFleetVehicleDto;

  @Expose()
  @Type(() => String)
  @ApiProperty({ type: String })
  public get id(): string {
    return this.fleetVehicle.id;
  }

  @Expose()
  @Type(() => String)
  @ApiProperty({ type: String })
  public get licencePlate(): string {
    return this.fleetVehicle.license_plate;
  }

  @Expose()
  @Type(() => FleetVehicleAboutEntity)
  @ApiProperty({ type: FleetVehicleAboutEntity })
  public get about(): FleetVehicleAboutDto {
    return new FleetVehicleAboutEntity(this.fleetVehicle);
  }

  @Expose()
  @Type(() => FleetVehicleDriverEntity)
  @ApiProperty({ type: FleetVehicleDriverEntity })
  public get driver(): FleetVehicleDriverDto {
    return this.fleetVehicle.selected_by_driver
      ? new FleetVehicleDriverEntity(this.fleetVehicle.selected_by_driver)
      : undefined;
  }

  @Expose()
  @Type(() => FleetVehicleUklonEntity)
  @ApiProperty({ type: FleetVehicleUklonEntity })
  public get uklon(): FleetVehicleUklonDto {
    return new FleetVehicleUklonEntity(this.fleetVehicle);
  }

  @Expose()
  @Type(() => VehicleBlockListStatusEntity)
  @ApiProperty({ type: VehicleBlockListStatusEntity })
  public get status(): BlockedListStatusDto {
    return this.fleetVehicle.status;
  }

  @Expose()
  @Type(() => VehicleDetailsPhotoControlEntity)
  @ApiProperty({ type: VehicleDetailsPhotoControlEntity })
  public get photo_control(): VehicleDetailsPhotoControlDto {
    return this.fleetVehicle.photo_control;
  }

  @Expose()
  @Type(() => VehicleBrandingPeriodEntity)
  @ApiProperty({ type: VehicleBrandingPeriodEntity })
  public get branding_period(): VehicleBrandingPeriodDto {
    return this.fleetVehicle.branding_period;
  }

  constructor(vehicle: GatewayFleetVehicleDto) {
    this.fleetVehicle = vehicle;
  }
}
