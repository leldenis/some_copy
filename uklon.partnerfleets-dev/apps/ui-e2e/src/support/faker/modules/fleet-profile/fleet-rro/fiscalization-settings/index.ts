import { FiscalizationFarePaymentType, FiscalizationVatType, FleetFiscalizationSettingsDto } from '@data-access';

import { ModuleBase } from '../../../_internal';

export type BuildProps = Partial<{
  vat_type: FiscalizationVatType;
  fare_payment_types: FiscalizationFarePaymentType[];
}>;

export class FleetFiscalizationSettingsModule extends ModuleBase<FleetFiscalizationSettingsDto> {
  public buildDto(props?: BuildProps): FleetFiscalizationSettingsDto {
    return {
      vat_type: props?.vat_type ?? FiscalizationVatType.RATE_0,
      fare_payment_types: props?.fare_payment_types ?? [FiscalizationFarePaymentType.CASH],
      service_product_name: 'Надання послуг з організації перевезень',
    };
  }
}
