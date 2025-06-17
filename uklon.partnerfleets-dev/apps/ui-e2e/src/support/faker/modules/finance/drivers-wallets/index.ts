import { DriverWalletsDto, EmployeeWalletItemDto } from '@data-access';

import { Currency } from '@uklon/types';

import { ModuleBase } from '../../_internal';

const DRIVERS_DEFAULT_COUNT = 5;

export type BuildProps = Partial<{
  total_amount?: number;
  drivers_wallets?: EmployeeWalletItemDto[];
  drivers_count?: number;
}>;

export class FleetDriversWalletsModule extends ModuleBase<DriverWalletsDto> {
  public buildDto(props?: BuildProps): DriverWalletsDto {
    return {
      total_drivers_balance: {
        amount: props?.total_amount ?? 50_000,
        currency: Currency.UAH,
      },
      items:
        props.drivers_wallets ??
        Array.from({ length: props?.drivers_count ?? DRIVERS_DEFAULT_COUNT }).map(this.buildDriver.bind(this)),
    };
  }

  private buildDriver(): EmployeeWalletItemDto {
    return {
      driver_id: this.faker.string.uuid(),
      first_name: this.faker.person.firstName(),
      last_name: this.faker.person.lastName(),
      phone: '576016567751',
      signal: 500_273,
      wallet: {
        id: this.faker.string.uuid(),
        balance: {
          amount: 10_000,
          currency: Currency.UAH,
        },
      },
    };
  }
}
