import { SplitPaymentDto } from '../../../finance/split-payment.dto';
import { GatewayAmountDto, GatewayDriverBonusDto, GatewayOrderCostDto, GatewayOrderPaymentsDto } from '../common';
import { GatewayOrderProductConditionDto } from '../order-history';

import { GatewayFleetOrderRouteDto } from './gateway-fleet-order-route.dto';

export enum FeeType {
  CASH = 'cash',
  CASHLESS = 'cashless',
  MIXED = 'mixed',
}

export interface GatewayFleetOrderIdleDto {
  time: number;
  cost: number;
  paid_idle_time: number;
  free_idle_time: number;
}

export interface GatewayFleetOrderDto {
  uid: string;
  driver_id: string;
  courier_id: string;
  vehicle_id: string;
  pickup_time: number;
  accepted_at: number;
  completed_at: number;
  route: GatewayFleetOrderRouteDto;
  cost: GatewayOrderCostDto;
  status: string;
  product_type: string;
  product_conditions: GatewayOrderProductConditionDto[];
  payment_method_id: string;
  payment_type: string;
  rating: number;
  payments: GatewayOrderPaymentsDto;
  driver_bonus: GatewayDriverBonusDto;
  order_system: string;
  optional: boolean;
  cancellation: { initiator: string; rejected: boolean };
  split_payments?: SplitPaymentDto[];
  corporate_payments: GatewayAmountDto;
  promo_discount: { amount: GatewayAmountDto };
  idle: GatewayFleetOrderIdleDto;
  finance_operations: {
    tips: number;
    penalty: number;
    compensation: number;
  };
}

export interface OverviewPolylineDto {
  uid: string;
  overwiew_polyline: string;
  traffic_info: {
    intervals: [
      {
        start: number;
        end: number;
        speed_level: string;
      },
    ];
  };
}
