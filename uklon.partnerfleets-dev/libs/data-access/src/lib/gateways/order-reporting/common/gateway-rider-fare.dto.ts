import { GatewayAmountDto } from './gateway-amount.dto';

export interface GatewayRiderFareDto {
  order_item_id: string;
  rider_id: string;
  cash_amount: GatewayAmountDto;
}
