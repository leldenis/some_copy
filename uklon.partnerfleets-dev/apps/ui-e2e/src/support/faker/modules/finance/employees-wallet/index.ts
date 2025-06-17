import { EmployeeWalletItemDto } from '@data-access';

import { Currency } from '@uklon/types';

import { ModuleBase } from '../../_internal';

export type BuildProps = Partial<{
  walletId?: string;
  driverId?: string;
  amount?: number;
}>;

export class FleetEmployeesWalletModule extends ModuleBase<EmployeeWalletItemDto> {
  public buildDto(props?: BuildProps): EmployeeWalletItemDto {
    return {
      employee_id: props?.driverId ?? this.faker.string.uuid(),
      driver_id: props?.driverId ?? this.faker.string.uuid(),
      first_name: this.faker.person.firstName(),
      last_name: this.faker.person.lastName(),
      phone: this.faker.phone.number(),
      signal: this.faker.number.int({ min: 0, max: 5 }),
      wallet: {
        id: props?.walletId ?? this.faker.string.uuid(),
        balance: {
          amount: props?.amount ?? 0,
          currency: Currency.UAH,
        },
      },
    };
  }
}
