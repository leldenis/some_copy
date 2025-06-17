import { GatewayDriverBonusDto, GatewayOrderCostDto, GatewayOrderPaymentsDto } from '../common';

import { GatewayOrderAddConditionDto } from './gateway-order-add-condition.dto';
import { GatewayOrderCancellationDto } from './gateway-order-cancellation.dto';
import { GatewayOrderIdleDto } from './gateway-order-idle.dto';
import { GatewayOrderItemDto } from './gateway-order-item.dto';
import { GatewayOrderProductConditionDto } from './gateway-order-product-condition.dto';
import { GatewayOrderRouteDto } from './gateway-order-route.dto';

export interface GatewayOrderDto {
  uid: string;
  driver_id: string;
  rider_id: string;
  vehicle_id: string;
  fleet_id: string;
  pickup_time: number;
  accepted_at: number;
  completed_at: number;
  route: GatewayOrderRouteDto;
  cost: GatewayOrderCostDto;
  status: string;
  product_type: string;
  add_conditions: GatewayOrderAddConditionDto[];
  product_conditions: GatewayOrderProductConditionDto[];
  payment_type: string;
  is_pickup_violation: boolean;
  payments: GatewayOrderPaymentsDto;
  idle: GatewayOrderIdleDto;
  cancellation: GatewayOrderCancellationDto;
  driver_bonus: GatewayDriverBonusDto;
  order_items: GatewayOrderItemDto[];
  order_system: string;
  optional: boolean;
}
