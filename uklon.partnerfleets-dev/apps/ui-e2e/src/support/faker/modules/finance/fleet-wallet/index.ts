import { MoneyDto, WalletDto } from '@data-access';

import { Currency } from '@uklon/types';

import { ModuleBase } from '../../_internal';

export type BuildProps = Partial<{
  walletId?: string;
  amount?: number;
}>;

export class FleetWalletModule extends ModuleBase<WalletDto> {
  public buildDto(props?: BuildProps): WalletDto {
    return {
      id: props?.walletId ?? this.faker.string.uuid(),
      balance: {
        amount: props?.amount ?? 1_000_000,
        currency: Currency.UAH,
      } as MoneyDto,
    };
  }
}
