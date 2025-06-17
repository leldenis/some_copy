import { OrderRouteEntity } from '@api/controllers/orders/entities/order-route.entity';
import {
  CourierDetailsDto,
  DeliveryRecordDto,
  FleetOrderRecordPaymentDto,
  GatewayOrderDto,
  OrderRecordDriverDto,
  OrderRecordRouteDto,
  PhotosDto,
} from '@data-access';
import { Exclude, Expose, Type } from 'class-transformer';

import { FleetOrderPaymentEntity } from './fleet-order-payment.entity';
import { OrderEmployeeEntity } from './order-driver.entity';

export class DeliveryEntity implements DeliveryRecordDto {
  @Exclude()
  private readonly fleetOrder: GatewayOrderDto;

  @Exclude()
  private readonly fleetCourier: CourierDetailsDto;

  @Exclude()
  private readonly courierPhotos: PhotosDto;

  @Exclude()
  private readonly overviewPolyline: string;

  @Expose()
  @Type(() => Number)
  public get completedAt(): number {
    return this.fleetOrder.completed_at;
  }

  @Expose()
  @Type(() => Number)
  public get createdAt(): number {
    return this.fleetOrder.accepted_at;
  }

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
  @Type(() => OrderRouteEntity)
  public get route(): OrderRecordRouteDto {
    return new OrderRouteEntity(this.fleetOrder.route, this.overviewPolyline);
  }

  @Expose()
  @Type(() => OrderEmployeeEntity)
  public get courier(): OrderRecordDriverDto {
    return new OrderEmployeeEntity(this.fleetCourier, this.courierPhotos);
  }

  constructor(order: GatewayOrderDto, courier: CourierDetailsDto, courierPhotos: PhotosDto, overviewPolyline: string) {
    this.fleetOrder = order;
    this.fleetCourier = courier;
    this.courierPhotos = courierPhotos;
    this.overviewPolyline = overviewPolyline;
  }
}
