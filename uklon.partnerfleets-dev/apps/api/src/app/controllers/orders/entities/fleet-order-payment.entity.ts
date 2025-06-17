import {
  CourierDeliveryCollectionItemDto,
  FleetOrderRecordPaymentDto,
  GatewayFleetOrderDto,
  GatewayOrderDto,
} from '@data-access';
import { Exclude, Expose, Type } from 'class-transformer';

export class FleetOrderPaymentEntity implements FleetOrderRecordPaymentDto {
  @Expose()
  @Type(() => Number)
  public get cost(): number {
    return this.order.cost.cost;
  }

  @Expose()
  @Type(() => String)
  public get currency(): string {
    return this.order.cost.currency;
  }

  @Expose()
  @Type(() => Number)
  public get distance(): number {
    return this.order.cost.distance;
  }

  @Expose()
  @Type(() => String)
  public get paymentType(): string {
    return this.order.payment_type;
  }

  @Expose()
  @Type(() => String)
  public get feeType(): string {
    return this.order.payments.fee_type;
  }

  @Exclude()
  private readonly order: GatewayFleetOrderDto | GatewayOrderDto | CourierDeliveryCollectionItemDto;

  constructor(order: GatewayFleetOrderDto | GatewayOrderDto | CourierDeliveryCollectionItemDto) {
    this.order = order;
  }
}
