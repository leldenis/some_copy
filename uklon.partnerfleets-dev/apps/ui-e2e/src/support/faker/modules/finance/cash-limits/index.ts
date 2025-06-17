import { CashLimitsSettingsDto, CashLimitsSettingsPeriod, CashLimitsSettingsUpdateDto } from '@data-access';

import { Currency } from '@uklon/types';

import { ModuleBase } from '../../_internal';

export type BuildProps = Partial<CashLimitsSettingsUpdateDto> & {
  noSettings?: boolean;
};

export class CashLimitsSettingsModule extends ModuleBase<CashLimitsSettingsDto, BuildProps> {
  public buildDto(props?: BuildProps): CashLimitsSettingsDto {
    return props?.noSettings
      ? null
      : {
          enabled: props?.enabled ?? false,
          limit: {
            amount: props?.amount ?? 0,
            currency: Currency.UAH,
          },
          period: props?.period ?? CashLimitsSettingsPeriod.WEEK,
        };
  }
}
