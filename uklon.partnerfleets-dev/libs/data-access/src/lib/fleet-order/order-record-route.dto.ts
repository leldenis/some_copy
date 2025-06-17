import { FleetOrderRecordRouteDto } from './fleet-order-record-route.dto';
import { OrderRecordRoutePointDto } from './order-record-route-point.dto';

export interface OrderRecordRouteDto extends FleetOrderRecordRouteDto {
  overviewPolyline: string;
  points: OrderRecordRoutePointDto[];
}
