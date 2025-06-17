export interface GatewayRoutePointDto {
  city_id: number;
  address_name: string;
  house_number: string;
  lat: number;
  lng: number;
  is_place: boolean;
  atype: string;
  type: string;
  entrance: number;
  comment: string;
  rider_id: string;
  order_item_id: string;
  status?: string;
}
