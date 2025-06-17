import { CursorQueryDto, DateRangeQuery } from '../common';
import {
  GatewayFleetOrderDistancePickUpDto,
  GatewayFleetOrderRouteDto,
  GatewayOrderCancellationDto,
  GatewayOrderCostDto,
  GatewayOrderPaymentsDto,
  GatewayOrderProductConditionDto,
} from '../gateways';

export interface CourierDeliveriesQueryDto extends Partial<DateRangeQuery>, CursorQueryDto {}

export interface CourierDeliveryItemDto {
  uid: string;
  courier_id: string;
  creator_id: string;
  fleet_id: string;
  pickup_time: number;
  accepted_at: number;
  completed_at: number;
  route: GatewayFleetOrderRouteDto;
  cost: GatewayOrderCostDto;
  status: string;
  product_type: string;
  product_conditions: GatewayOrderProductConditionDto[];
  payment_type: string;
  payments: GatewayOrderPaymentsDto;
  cancellation: GatewayOrderCancellationDto;
  optional: boolean;
  distance_to_pickup: GatewayFleetOrderDistancePickUpDto;
}
