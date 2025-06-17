export enum ActiveOrderStatus {
  RUNNING = 'Running',
  ACCEPTED = 'Accepted',
  ARRIVED = 'Arrived',
}

export interface ActiveOrderItemDto {
  order_id: string;
  pickup_time: number;
  product_type: string;
  add_conditions: { name: string }[];
  product_conditions: unknown[];
  status: ActiveOrderStatus;
  is_suspended: boolean;
  riders: ActiveOrderDriverDto[];
  route: ActiveOrderRouteDto;
  cost: ActiveOrderCostDto;
  idle: ActiveOrderIdleDto;
  payment_type: string;
  payments: ActiveOrderPaymentsDto;
  order_items: ActiveOrderOrderItemDto[];
  rider_debt: ActiveOrderRiderDebtDto;
  order_system: string;
}

export interface ActiveOrderDriverDto {
  uid: string;
  first_name: string;
  rating: number;
  phone: string;
}

export interface ActiveOrderRouteDto {
  sector_start: string;
  sector_end: string;
  route_points: RoutePointDto[];
  overwiew_polyline: string;
  distance: number;
  suburban_distance: number;
}

export interface RoutePointDto {
  address_name: string;
  lat: number;
  lng: number;
  type: string;
  rider_id: string;
  order_item_id: string;
}

export interface ActiveOrderCostDto {
  cost: number;
  currency: string;
  extra_cost: number;
  initial_cost: number;
  cancellation_fare: number;
  surge_cost_limit_extra: number;
  cost_multiplier: number;
  applied_cost_multiplier: number;
  rider_multiplier: number;
  distance: number;
  suburban_distance: number;
}

export interface ActiveOrderIdleDto {
  time: number;
  paid_time: number;
  cost: number;
  is_active: boolean;
  total_idle_seconds: number;
}

export interface ActiveOrderPaymentsDto {
  fee_type: string;
  rider_fares: RiderFareDto[];
}

export interface RiderFareDto {
  order_item_id: string;
  rider_id: string;
  cash_amount: CashAmountDto;
}

export interface CashAmountDto {
  amount: number;
  currency_code: string;
}

export interface ActiveOrderOrderItemDto {
  id: string;
  status: string;
  rider_id: string;
}

export interface ActiveOrderRiderDebtDto {
  amount: number;
  currency_code: string;
}
