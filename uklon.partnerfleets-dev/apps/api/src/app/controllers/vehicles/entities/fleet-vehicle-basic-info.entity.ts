import { VehicleBasicInfoDto } from '@data-access';
import { Exclude, Expose, Type } from 'class-transformer';

export class FleetVehicleBasicInfoEntity implements VehicleBasicInfoDto {
  @Exclude()
  private readonly vehicle: VehicleBasicInfoDto;

  @Expose()
  @Type(() => String)
  public get vehicle_id(): string {
    return this.vehicle?.vehicle_id;
  }

  @Expose()
  @Type(() => String)
  public get license_plate(): string {
    return this.vehicle.license_plate;
  }

  @Expose()
  @Type(() => String)
  public get color(): string {
    return this.vehicle.color;
  }

  @Expose()
  @Type(() => String)
  public get comfort_level(): string {
    return this.vehicle.comfort_level;
  }

  @Expose()
  @Type(() => Boolean)
  public get has_dispatching_priority(): boolean {
    return this.vehicle.has_dispatching_priority;
  }

  @Expose()
  @Type(() => Boolean)
  public get is_branded(): boolean {
    return this.vehicle.is_branded;
  }

  @Expose()
  @Type(() => String)
  public get make(): string {
    return this.vehicle.make;
  }

  @Expose()
  @Type(() => String)
  public get model(): string {
    return this.vehicle.model;
  }

  @Expose()
  @Type(() => Number)
  public get production_year(): number {
    return this.vehicle.production_year;
  }

  @Expose()
  @Type(() => String)
  public get selected_by_driver_id(): string {
    return this.vehicle?.selected_by_driver_id;
  }

  constructor(vehicle: VehicleBasicInfoDto) {
    this.vehicle = vehicle;
  }
}
