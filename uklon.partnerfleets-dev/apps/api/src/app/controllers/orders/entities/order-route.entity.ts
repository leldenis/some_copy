import { GatewayOrderRouteDto, OrderRecordRouteDto, OrderRecordRoutePointDto } from '@data-access';
import { Exclude, Expose, Type } from 'class-transformer';

import { OrderRoutePointEntity } from './order-route-point.entity';

export class OrderRouteEntity implements OrderRecordRouteDto {
  @Exclude()
  private readonly route: GatewayOrderRouteDto;

  @Exclude()
  private readonly polyline: string;

  @Expose()
  @Type(() => String)
  public get overviewPolyline(): string {
    return this.polyline;
  }

  @Expose()
  @Type(() => OrderRoutePointEntity)
  public get points(): OrderRecordRoutePointDto[] {
    return this.route.route_points.map((point) => new OrderRoutePointEntity(point));
  }

  constructor(route: GatewayOrderRouteDto, overviewPolyline: string) {
    this.route = route;
    this.polyline = overviewPolyline;
  }
}
