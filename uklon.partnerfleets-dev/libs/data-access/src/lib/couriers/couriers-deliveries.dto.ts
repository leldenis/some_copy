import { OrderStatus } from '@constant';

import { CollectionDto, CursorDto, CursorQueryDto } from '../common';
import { FleetOrderRecordRouteDto, FleetOrderRecordPaymentDto } from '../fleet-order';
import { GatewayFleetOrderRouteDto, GatewayOrderPaymentsDto } from '../gateways';

export interface CouriersDeliveriesQueryDto extends CursorQueryDto {
  from: number;
  to: number;
  fleet_id: string;
  status?: OrderStatus | '';
  courier_id?: string;
}

export interface CourierDeliveryDto {
  id: string;
  status: string;
  route: FleetOrderRecordRouteDto;
  payment: FleetOrderRecordPaymentDto;
  pickupTime: number;
  courier: {
    id: string;
    fullName: string;
  };
}

export interface CourierDeliveryCollectionItemDto {
  uid: string;
  courier_id: string;
  creator_id: string;
  fleet_id: string;
  pickup_time: number;
  accepted_at: number;
  completed_at: number;
  route: GatewayFleetOrderRouteDto;
  cost: CostDto;
  status: string;
  product_type: string;
  product_conditions: CourierDeliveryProductConditionDto[];
  payment_type: string;
  payments: GatewayOrderPaymentsDto;
  cancellation: { initiator: string; rejected: boolean; reason: string };
  optional: boolean;
  distance_to_pickup: CourierDeliveryDistanceToPickupDto;
}

export interface CostDto {
  cost: number;
  currency: string;
  distance: number;
}

export interface CourierDeliveryProductConditionDto {
  name: string;
  data: string;
}

export interface CourierDeliveryDistanceToPickupDto {
  full_distance_meters: number;
  distance_to_intermediate_points_meters: number;
  distance_source: string;
}

export interface FleetCouriersDeliveriesCollectionDto extends CollectionDto<CourierDeliveryDto>, CursorDto {}
