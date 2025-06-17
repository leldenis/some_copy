export enum DriverPaymentAccountType {
  INDIVIDUAL = 'Individual',
  LEGAL_ENTITY = 'LegalEntity',
}

export interface DriverPaymentInfoDto {
  account_type: DriverPaymentAccountType;
  address: string;
  account_owner: string;
  account_number: string;
  bank_name_or_swift_code: string;
  company_name?: string;
  registration_number?: string;
  vat_payer_number?: string;
}
