export interface AddPaymentCardDto {
  pan: string;
  expiration_year: number;
  expiration_month: number;
  verification_code: string;
}
