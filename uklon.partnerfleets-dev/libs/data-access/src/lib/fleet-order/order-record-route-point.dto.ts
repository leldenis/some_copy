import { FleetOrderRecordRoutePointDto } from './fleet-order-record-route-point.dto';

export interface OrderRecordRoutePointDto extends FleetOrderRecordRoutePointDto {
  latitude: number;
  longitude: number;
}
