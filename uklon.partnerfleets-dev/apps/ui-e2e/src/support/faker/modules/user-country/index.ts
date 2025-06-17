import { CountryDto } from '@data-access';

import { AccountCountry } from '@uklon/types';

import { ModuleBase } from '../_internal';

export type BuildProps = Partial<{
  country: AccountCountry;
}>;

export class UserCountryModule extends ModuleBase<CountryDto, BuildProps> {
  public buildDto(props?: BuildProps): CountryDto {
    return {
      country: props?.country ?? AccountCountry.Ukraine,
    };
  }
}
