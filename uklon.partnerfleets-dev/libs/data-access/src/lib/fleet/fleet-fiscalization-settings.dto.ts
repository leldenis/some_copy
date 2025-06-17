export enum FiscalizationVatType {
  RATE_0 = 'rate0',
  RATE_20 = 'rate20',
  WITHOUT_VAT = 'without_vat',
  TAX_FREE = 'tax_free',
}

export enum FiscalizationFarePaymentType {
  CASH = 'cash',
  CASHLESS = 'cashless',
  CORPORATE = 'corporate',
}

export interface FleetFiscalizationSettingsDto {
  vat_type: FiscalizationVatType;
  fare_payment_types: FiscalizationFarePaymentType[];
  service_product_name?: string;
}

export enum FiscalizationStatusValue {
  ENABLED = 'enabled',
  DISABLED = 'disabled',
}

export interface FleetFiscalizationStatusValueDto {
  status: FiscalizationStatusValue;
}

export interface FleetFiscalizationStatusDto {
  status: boolean;
}

export interface UpdateFleetFiscalizationStatusDto extends FleetFiscalizationStatusDto {
  success: string;
  error: string;
}
