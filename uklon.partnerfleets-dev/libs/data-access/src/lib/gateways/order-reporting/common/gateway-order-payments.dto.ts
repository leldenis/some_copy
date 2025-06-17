import { GatewayRiderFareDto } from './gateway-rider-fare.dto';

export interface GatewayOrderPaymentsDto {
  fee_type: string;
  rider_fares: GatewayRiderFareDto[];
}
