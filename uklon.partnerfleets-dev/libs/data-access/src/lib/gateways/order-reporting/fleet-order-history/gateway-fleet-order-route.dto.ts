import { GatewayRoutePointDto } from '../common';

export interface GatewayFleetOrderRouteDto {
  comment: string;
  entrance: number;
  route_points: GatewayRoutePointDto[];
  sector_start: string;
  sector_end: string;
  is_office_building: boolean;
}
