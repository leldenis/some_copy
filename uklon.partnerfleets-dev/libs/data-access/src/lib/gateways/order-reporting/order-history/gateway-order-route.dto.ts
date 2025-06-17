import { GatewayRoutePointDto } from '../common';

export interface GatewayOrderRouteDto {
  comment: string;
  entrance: number;
  route_points: GatewayRoutePointDto[];
  sector_start: string;
  sector_end: string;
  overview_polyline: string;
  is_office_building: boolean;
}
