import { WalletToCardTransferSettingsDto } from '@data-access';

import { ModuleBase } from '../../_internal';

export type BuildProps = Partial<{
  max_amount?: number;
  max_amount_per_day?: number;
  max_count_per_day?: number;
  min_amount?: number;
}>;

export class WithdrawToCardSettingsModule extends ModuleBase<WalletToCardTransferSettingsDto> {
  public buildDto(props?: BuildProps): WalletToCardTransferSettingsDto {
    return {
      max_amount: props?.max_amount ?? 5000,
      max_amount_per_day: props?.max_amount ?? 10_000,
      max_count_per_day: props?.max_amount ?? 20,
      min_amount: props?.max_amount ?? 20,
    };
  }
}
