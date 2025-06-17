import { AccountCountry } from '@uklon/types';

export const COUNTRY_PHONE_PROPS: Record<string, { mask: string; placeholder: string }> = {
  [AccountCountry.Ukraine]: { mask: 'XX XXX XX XX', placeholder: '93 544 35 21' },
  [AccountCountry.Azerbaijan]: { mask: 'XX XXX XX XX', placeholder: '12 370 21 99' },
  [AccountCountry.Uzbekistan]: { mask: 'XX XXX XX XX', placeholder: '90 900 12 34' },
};
