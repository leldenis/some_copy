import { FleetOrderRecordRouteDto, FleetOrderRecordRoutePointDto, GatewayFleetOrderRouteDto } from '@data-access';
import { Exclude, Expose, Type } from 'class-transformer';

import { FleetOrderRoutePointEntity } from './fleet-order-route-point.entity';

export class FleetOrderRouteEntity implements FleetOrderRecordRouteDto {
  @Expose()
  @Type(() => FleetOrderRoutePointEntity)
  public get points(): FleetOrderRecordRoutePointDto[] {
    return this.route.route_points.map((point) => new FleetOrderRoutePointEntity(point));
  }

  @Exclude()
  private readonly route: GatewayFleetOrderRouteDto;

  constructor(route: GatewayFleetOrderRouteDto) {
    this.route = route;
  }
}
