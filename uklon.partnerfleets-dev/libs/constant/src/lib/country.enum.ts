import { AccountCountry } from '@uklon/types';

export enum PopularCountryOrder {
  UKRAINE,
  AZERBAIJAN,
  UZBEKISTAN,
}

export const POPULAR_COUNTRY_ORDER: Partial<Record<AccountCountry, PopularCountryOrder>> = {
  [AccountCountry.Ukraine]: PopularCountryOrder.UKRAINE,
  [AccountCountry.Azerbaijan]: PopularCountryOrder.AZERBAIJAN,
  [AccountCountry.Uzbekistan]: PopularCountryOrder.UZBEKISTAN,
} as const;
