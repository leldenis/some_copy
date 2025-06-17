import { FleetOrderRecordRoutePointDto, GatewayRoutePointDto } from '@data-access';
import { Exclude, Expose, Type } from 'class-transformer';

export class FleetOrderRoutePointEntity implements FleetOrderRecordRoutePointDto {
  @Expose()
  @Type(() => String)
  public get address(): string {
    return this.point.address_name;
  }

  @Exclude()
  private readonly point: GatewayRoutePointDto;

  constructor(point: GatewayRoutePointDto) {
    this.point = point;
  }
}
//
// @Expose()
// @Type(() => Number)
// public get latitude(): number {
//   return this._point.lat;
// }
//
// @Expose()
// @Type(() => Number)
// public get longitude(): number {
//   return this._point.lng;
// }
