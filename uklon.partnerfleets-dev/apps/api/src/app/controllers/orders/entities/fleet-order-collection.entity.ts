import {
  FleetDriverBasicInfoDto,
  FleetOrderRecordDto,
  FleetOrderRecordCollectionDto,
  GatewayFleetOrderCollectionDto,
  IndividualEntrepreneurDto,
  VehicleBasicInfoDto,
} from '@data-access';
import { Exclude, Expose, Type } from 'class-transformer';

import { FleetOrderEntity } from './fleet-order.entity';

export class FleetOrderCollectionEntity implements FleetOrderRecordCollectionDto {
  @Exclude()
  private readonly collection: GatewayFleetOrderCollectionDto;

  @Exclude()
  private readonly drivers: Map<string, FleetDriverBasicInfoDto>;

  @Exclude()
  private readonly vehicles: Map<string, VehicleBasicInfoDto>;

  @Exclude()
  private readonly entrepreneurs: IndividualEntrepreneurDto[];

  @Expose()
  @Type(() => FleetOrderEntity)
  public get items(): FleetOrderRecordDto[] {
    return this.collection.items.map(
      (order) =>
        new FleetOrderEntity(
          order,
          this.drivers.get(order.driver_id),
          this.vehicles.get(order.vehicle_id),
          this.entrepreneurs,
        ),
    );
  }

  @Expose()
  @Type(() => Number)
  public get cursor(): number {
    return this.collection.next_cursor;
  }

  constructor(
    collection: GatewayFleetOrderCollectionDto,
    drivers: Map<string, FleetDriverBasicInfoDto>,
    vehicles: Map<string, VehicleBasicInfoDto>,
    entrepreneurs: IndividualEntrepreneurDto[],
  ) {
    this.collection = collection;
    this.drivers = drivers;
    this.vehicles = vehicles;
    this.entrepreneurs = entrepreneurs;
  }
}
