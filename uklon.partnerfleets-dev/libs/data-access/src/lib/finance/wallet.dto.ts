import { MoneyDto } from './money.dto';

export interface WalletDto {
  id: string;
  balance: MoneyDto;
}

export enum WithdrawalType {
  PAYMENT_CARD = 'PaymentCard',
  INDIVIDUAL_ENTREPRENEUR = 'IndividualEntrepreneur',
  NONE = 'None',
}

export enum FleetMerchant {
  FONDY = 'Fondy',
  IPAY = 'IPay',
  PLATON = 'Platon',
}

export interface IndividualEntrepreneurDto {
  id?: string;
  is_selected?: boolean;
  name: string;
  payment_providers: PaymentProviderDto[];
}

export interface PaymentProviderDto {
  merchant_id: string;
  type: FleetMerchant;
  merchant_binding_id: string;
}

export interface IndividualEntrepreneurCollectionDto {
  withdrawal_type?: WithdrawalType;
  has_more_items: boolean;
  items: IndividualEntrepreneurDto[];
}

export interface FleetWithdrawalTypeDto {
  withdrawal_type: WithdrawalType;
}

export interface PaymentProvideIdentificationStatusesDto {
  payment_provider_type: FleetMerchant;
  is_identified: boolean;
}
