import { DriverFinanceAllowing } from '@constant';
import { DriverFinanceAllowingDto, DriverFinanceProfileDto } from '@data-access';

import { ModuleBase } from '../../_internal';

export type BuildProps = Partial<{
  order_payment_to_card?: DriverFinanceAllowingDto;
  wallet_to_card_transfer?: DriverFinanceAllowingDto;
}>;

export class FleetDriverFinanceProfileModule extends ModuleBase<DriverFinanceProfileDto, BuildProps> {
  public buildDto(props?: BuildProps): DriverFinanceProfileDto {
    return {
      order_payment_to_card: props?.order_payment_to_card ?? {
        configured_by: DriverFinanceAllowing.UKLON_MANAGER,
        is_allowing: false,
      },
      wallet_to_card_transfer: props?.wallet_to_card_transfer ?? {
        configured_by: DriverFinanceAllowing.UKLON_MANAGER,
        is_allowing: false,
      },
    };
  }
}
