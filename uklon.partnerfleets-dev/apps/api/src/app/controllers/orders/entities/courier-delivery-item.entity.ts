import { GatewayOrderProductConditionEntity } from '@api/controllers/orders/entities/gateway-order-product-condition.entity';
import {
  CourierDeliveryItemDto,
  GatewayFleetOrderDistancePickUpDto,
  GatewayFleetOrderRouteDto,
  GatewayOrderCancellationDto,
  GatewayOrderCostDto,
  GatewayOrderPaymentsDto,
  GatewayOrderProductConditionDto,
} from '@data-access';
import { ApiProperty } from '@nestjs/swagger';

export class CourierDeliveryItemEntity implements CourierDeliveryItemDto {
  @ApiProperty({ type: String })
  public uid: string;

  @ApiProperty({ type: String })
  public courier_id: string;

  @ApiProperty({ type: String })
  public creator_id: string;

  @ApiProperty({ type: String })
  public fleet_id: string;

  @ApiProperty({ type: Number })
  public pickup_time: number;

  @ApiProperty({ type: Number })
  public accepted_at: number;

  @ApiProperty({ type: Number })
  public completed_at: number;

  @ApiProperty({ type: Object })
  public route: GatewayFleetOrderRouteDto;

  @ApiProperty({ type: String })
  public cost: GatewayOrderCostDto;

  @ApiProperty({ type: String })
  public status: string;

  @ApiProperty({ type: String })
  public product_type: string;

  @ApiProperty({ type: GatewayOrderProductConditionEntity, isArray: true })
  public product_conditions: GatewayOrderProductConditionDto[];

  @ApiProperty({ type: String })
  public payment_type: string;

  @ApiProperty({ type: Object })
  public payments: GatewayOrderPaymentsDto;

  @ApiProperty({ type: Object })
  public cancellation: GatewayOrderCancellationDto;

  @ApiProperty({ type: Boolean })
  public optional: boolean;

  @ApiProperty({ type: Object })
  public distance_to_pickup: GatewayFleetOrderDistancePickUpDto;
}
