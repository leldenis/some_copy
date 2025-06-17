import { FleetMerchant } from './wallet.dto';

export interface ChangePaymentProviderDto {
  type: FleetMerchant;
  merchant_id?: string;
  payment_channel_id?: string;
}
