import {
  FleetMerchant,
  IndividualEntrepreneurDto,
  IndividualEntrepreneurCollectionDto,
  PaymentProviderDto,
  WithdrawalType,
} from '@data-access';

import { ModuleBase } from '../../_internal';

const ENTREPRENEUR_DEFAULT_COUNT = 0;
const PROVIDER_DEFAULT_COUNT = 1;

export type BuildProps = Partial<{
  withdrawal_type: WithdrawalType;
  entrepreneur_count?: number;
  merchant_count?: number;
  entrepreneur?: IndividualEntrepreneurDto[];
}>;

export class IndividualEntrepreneursModule extends ModuleBase<IndividualEntrepreneurCollectionDto> {
  public buildDto(props?: BuildProps): IndividualEntrepreneurCollectionDto {
    return {
      withdrawal_type: props?.withdrawal_type ?? WithdrawalType.INDIVIDUAL_ENTREPRENEUR,
      has_more_items: false,
      items:
        props.entrepreneur ??
        Array.from({ length: props?.entrepreneur_count ?? ENTREPRENEUR_DEFAULT_COUNT }).map((_, index) =>
          this.buildEntrepreneur.bind(index, this),
        ),
    };
  }
  private buildEntrepreneur(index: number, props?: BuildProps): IndividualEntrepreneurDto {
    return {
      id: this.faker.string.uuid(),
      is_selected: index === 0,
      name: this.faker.finance.accountName(),
      payment_providers: Array.from({ length: props?.merchant_count ?? PROVIDER_DEFAULT_COUNT }).map(
        this.buildProvider.bind(this),
      ),
    };
  }

  private buildProvider(): PaymentProviderDto {
    return {
      merchant_id: this.faker.finance.accountNumber(5),
      type: FleetMerchant.IPAY,
      merchant_binding_id: this.faker.string.uuid(),
    };
  }
}
