export interface TransactionsSettingsDto {
  currency: string;
  supported_online_payments: SupportedOnlinePaymentsDto;
  card_to_wallet_transfer_settings: CardToWalletTransferSettingsDto;
  wallet_to_card_transfer_settings: WalletToCardTransferSettingsDto;
  deny_fare_funds_transferring: boolean;
  p2p_funds_transferring_enabled: boolean;
  is_p2p_receiver_tax_id_number_required: boolean;
  manual_withdrawal_settings: ManualWithdrawalSettingsDto;
}

export interface SupportedOnlinePaymentsDto {
  apple_pay: boolean;
  google_pay: boolean;
}

export interface CardToWalletTransferSettingsDto {
  constraints: ConstraintsDto;
  fee: FeeDto;
}

export interface ConstraintsDto {
  min_amount: number;
  max_amount: number;
}

export interface FeeDto {
  fee_percentage: number;
  fixed_fee_amount: number;
}

export interface WalletToCardTransferSettingsDto {
  min_amount: number;
  max_amount: number;
  max_count_per_day: number;
  max_amount_per_day: number;
}

export interface ManualWithdrawalSettingsDto {
  is_iban_required: boolean;
  is_receiver_required: boolean;
  iban_country_code: string;
  is_tax_id_number_required: boolean;
  is_allowed_for_private_drivers: boolean;
}
