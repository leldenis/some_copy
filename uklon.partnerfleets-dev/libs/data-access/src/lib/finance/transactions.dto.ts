import { MoneyDto } from './money.dto';

export interface TransactionDto {
  transaction_date: number;
  transaction_type: string;
  balance_delta: MoneyDto;
  balance: MoneyDto;
}

export interface TransactionStatusDto {
  error_code?: TransactionErrorCode;
  transfer_id: string;
  status: TransactionStatus;
}

export enum TransactionStatus {
  PROCESSING = 'Processing',
  FAILED = 'Failed',
  COMPLETED = 'Completed',
}

export enum TransactionErrorCode {
  NONE = 'None',
  WALLET_NOT_FOUND = 'WalletNotFound',
  INVALID_COMMAND = 'InvalidCommand',
  INSUFFICIENT_FUNDS = 'InsufficientFunds',
  UNEXPECTED = 'Unexpected',
  HOLD_COMPLETE_CANNOT_BE_PROCESSING = 'HoldCompleteCannotBeProcessing',
  PAYMENT_ERROR_INSUFFICIENT_FUNDS_ON_CARD = 'PaymentErrorInsufficientFundsOnCard',
  PAYMENT_ERROR_EXCEED_CARD_WITHDRAWAL_FREQUENCY = 'PaymentErrorExceedCardWithdrawalFrequency',
  PAYMENT_ERROR_EXPIRED_CARD = 'PaymentErrorExpiredCard',
  PAYMENT_ERROR_INVALID_CARD = 'PaymentErrorInvalidCard',
  PAYMENT_ERROR_DECLINED_TO_CARD_ISSUER = 'PaymentErrorDeclinedToCardIssuer',
  PAYMENT_ERROR_OTHER = 'PaymentErrorOther',
  PAYMENT_ERROR_WALLET_TO_CARD_FORBIDDEN = 'PaymentErrorWalletToCardForbidden',
  PAYMENT_ERROR_WALLET_TO_CARD_WITHDRAWAL_COUNT_REACHED = 'PaymentErrorWalletToCardWithdrawalCountReached',
  PAYMENT_ERROR_WALLET_TO_CARD_INVALID_PAYMENT_CARD = 'PaymentErrorWalletToCardInvalidPaymentCard',
  PAYMENT_ERROR_WALLET_TO_CARD_INVALID_AMOUNT = 'PaymentErrorWalletToCardInvalidAmount',
  PAYMENT_ERROR_WALLET_TO_CARD_WITHDRAWAL_TOTAL_LIMIT_AMOUNT_REACHED = 'PaymentErrorWalletToCardWithdrawalTotalLimitAmountReached',
  PAYMENT_ERROR_WALLET_TO_CARD_P2P_RECEIVER_IDENTIFICATION_REQUIRED = 'PaymentErrorWalletToCardP2PReceiverIdentificationRequired',
  PAYMENT_ERROR_WALLET_TO_CARD_CURRENT_BALANCE_LIMIT_EXCEED_FOR_ITN = 'PaymentErrorWalletToCardCurrentBalanceLimitExceedForItn',
}
