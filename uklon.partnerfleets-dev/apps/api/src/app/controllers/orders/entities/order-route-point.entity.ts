import { GatewayRoutePointDto, OrderRecordRoutePointDto } from '@data-access';
import { Exclude, Expose, Type } from 'class-transformer';

export class OrderRoutePointEntity implements OrderRecordRoutePointDto {
  @Expose()
  @Type(() => String)
  public get address(): string {
    return this.point.address_name;
  }

  @Expose()
  @Type(() => Number)
  public get latitude(): number {
    return this.point.lat;
  }

  @Expose()
  @Type(() => Number)
  public get longitude(): number {
    return this.point.lng;
  }

  @Exclude()
  private readonly point: GatewayRoutePointDto;

  constructor(point: GatewayRoutePointDto) {
    this.point = point;
  }
}
