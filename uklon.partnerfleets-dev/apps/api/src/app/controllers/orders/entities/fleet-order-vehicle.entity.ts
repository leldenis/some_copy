import {
  FleetOrderRecordVehicleDto,
  GatewayFleetOrderDto,
  GatewayOrderProductConditionDto,
  VehicleBasicInfoDto,
} from '@data-access';
import { Exclude, Expose, Type } from 'class-transformer';

export class FleetOrderVehicleEntity implements FleetOrderRecordVehicleDto {
  @Expose()
  @Type(() => String)
  public get id(): string {
    return this.order.vehicle_id;
  }

  @Expose()
  @Type(() => String)
  public get licencePlate(): string | undefined {
    return this.vehicle?.license_plate;
  }

  @Expose()
  @Type(() => String)
  public get productType(): string {
    return this.order.product_type;
  }

  @Expose()
  @Type(() => Array<GatewayOrderProductConditionDto>)
  public get productConditions(): GatewayOrderProductConditionDto[] {
    return this.order?.product_conditions;
  }

  @Exclude()
  private readonly order: GatewayFleetOrderDto;

  @Exclude()
  private readonly vehicle?: VehicleBasicInfoDto;

  constructor(order: GatewayFleetOrderDto, vehicle?: VehicleBasicInfoDto) {
    this.order = order;
    this.vehicle = vehicle;
  }
}
