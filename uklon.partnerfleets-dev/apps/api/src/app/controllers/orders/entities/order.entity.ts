import { OrderRouteEntity } from '@api/controllers/orders/entities/order-route.entity';
import {
  FleetDriverDto,
  FleetOrderRecordPaymentDto,
  GatewayOrderDto,
  OrderRecordDto,
  OrderRecordDriverDto,
  OrderRecordRouteDto,
  OrderRecordVehicleDto,
  PhotosDto,
  VehicleDetailsDto,
} from '@data-access';
import { Exclude, Expose, Type } from 'class-transformer';

import { FleetOrderPaymentEntity } from './fleet-order-payment.entity';
import { OrderEmployeeEntity } from './order-driver.entity';
import { OrderVehicleEntity } from './order-vehicle.entity';

export class OrderEntity implements OrderRecordDto {
  @Exclude()
  private readonly fleetOrder: GatewayOrderDto;

  @Exclude()
  private readonly fleetDriver: FleetDriverDto;

  @Exclude()
  private readonly fleetVehicle: VehicleDetailsDto;

  @Exclude()
  private readonly driverPhotos: PhotosDto;

  @Exclude()
  private readonly vehiclePhotos: PhotosDto;

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
  public get driver(): OrderRecordDriverDto {
    return new OrderEmployeeEntity(this.fleetDriver, this.driverPhotos);
  }

  @Expose()
  @Type(() => OrderVehicleEntity)
  public get vehicle(): OrderRecordVehicleDto {
    return this.fleetVehicle
      ? new OrderVehicleEntity(this.fleetVehicle, this.fleetOrder.product_type, this.vehiclePhotos)
      : null;
  }

  constructor(
    order: GatewayOrderDto,
    driver: FleetDriverDto,
    vehicle: VehicleDetailsDto,
    driverPhotos: PhotosDto,
    vehiclePhotos: PhotosDto,
    overviewPolyline: string,
  ) {
    this.fleetOrder = order;
    this.fleetDriver = driver;
    this.fleetVehicle = vehicle;
    this.driverPhotos = driverPhotos;
    this.vehiclePhotos = vehiclePhotos;
    this.overviewPolyline = overviewPolyline;
  }
}
