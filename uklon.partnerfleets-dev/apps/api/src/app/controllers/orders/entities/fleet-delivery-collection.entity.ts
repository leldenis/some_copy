import {
  CollectionDto,
  CourierDeliveryDto,
  CourierDeliveryCollectionItemDto,
  FleetCourierNameByIdDto,
  FleetCouriersDeliveriesCollectionDto,
  FleetOrderRecordEmployeeDto,
  FleetOrderRecordPaymentDto,
  FleetOrderRecordRouteDto,
  GatewayCursorDto,
} from '@data-access';
import { Exclude, Expose, Type } from 'class-transformer';

import { FleetOrderEmployeeEntity } from './fleet-order-employee.entity';
import { FleetOrderPaymentEntity } from './fleet-order-payment.entity';
import { FleetOrderRouteEntity } from './fleet-order-route.entity';

export class FleetDeliveryEntity implements CourierDeliveryDto {
  @Exclude()
  private readonly fleetOrder: CourierDeliveryCollectionItemDto;

  @Exclude()
  private readonly fleetCourier: FleetCourierNameByIdDto;

  @Expose()
  @Type(() => String)
  public get id(): string {
    return this.fleetOrder.uid;
  }

  @Expose()
  @Type(() => Number)
  public get pickupTime(): number {
    return this.fleetOrder.pickup_time;
  }

  @Expose()
  @Type(() => String)
  public get status(): string {
    return this.fleetOrder.status;
  }

  @Expose()
  @Type(() => Boolean)
  public get optional(): boolean {
    return this.fleetOrder?.optional;
  }

  @Expose()
  @Type(() => FleetOrderPaymentEntity)
  public get payment(): FleetOrderRecordPaymentDto {
    return new FleetOrderPaymentEntity(this.fleetOrder);
  }

  @Expose()
  @Type(() => FleetOrderRouteEntity)
  public get route(): FleetOrderRecordRouteDto {
    return new FleetOrderRouteEntity(this.fleetOrder.route);
  }

  @Expose()
  @Type(() => FleetOrderEmployeeEntity)
  public get courier(): FleetOrderRecordEmployeeDto {
    return new FleetOrderEmployeeEntity(this.fleetOrder, this.fleetCourier);
  }

  constructor(delivery: CourierDeliveryCollectionItemDto, fleetCourier: FleetCourierNameByIdDto) {
    this.fleetOrder = delivery;
    this.fleetCourier = fleetCourier;
  }
}

export class FleetDeliveryCollectionEntity implements FleetCouriersDeliveriesCollectionDto {
  @Exclude()
  private readonly collection: CollectionDto<CourierDeliveryCollectionItemDto> & GatewayCursorDto;

  @Exclude()
  private readonly couriers: Map<string, FleetCourierNameByIdDto>;

  @Expose()
  @Type(() => FleetDeliveryEntity)
  public get items(): CourierDeliveryDto[] {
    return this.collection.items.map((delivery) => {
      return new FleetDeliveryEntity(delivery, this.couriers.get(delivery.courier_id));
    });
  }

  @Expose()
  @Type(() => Number)
  public get cursor(): number {
    return this.collection.next_cursor;
  }

  constructor(
    collection: CollectionDto<CourierDeliveryCollectionItemDto> & GatewayCursorDto,
    couriers: Map<string, FleetCourierNameByIdDto>,
  ) {
    this.collection = collection;
    this.couriers = couriers;
  }
}
