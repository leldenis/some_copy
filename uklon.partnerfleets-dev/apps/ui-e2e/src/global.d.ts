/* eslint-disable @typescript-eslint/no-unnecessary-type-arguments */
declare namespace NodeJS {
  interface ProcessEnv {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    CYPRESS_USERNAME: string;
  }
}

declare namespace Cypress {
  interface LoginOptions {
    rememberUser: boolean;
  }

  type DateRangeOption =
    | 'today'
    | 'yesterday'
    | 'current-week'
    | 'last-week'
    | 'current-month'
    | 'last-month'
    | 'current-quarter'
    | 'last-quarter'
    | 'custom';

  interface Chainable {
    setLocalStorage: (key: string, value: string | number) => Chainable<void>;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getBySel: (dataTestAttribute: string, args?: any) => Chainable<JQuery<HTMLElement>>;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getBySelLike: (dataTestPrefixAttribute: string, args?: any) => Chainable<JQuery<HTMLElement>>;

    login: (username?: string, password?: string, authMethod?: 'password' | 'sms', loginOptions?: LoginOptions) => void;

    loginWithSession: (sessionName: string, username?: string, password?: string) => void;

    logout: () => void;

    navigateByUrl: (url: string) => void;

    setLocale: (idx: number) => void;

    useDateRangeFilter: (option?: DateRangeOption, from?: string, to?: string) => void;

    useDriverFilter: (index?: number, fullName?: string | 'all') => void;

    useVehicleFilter: (index?: number, licencePlate?: string | 'all') => void;

    getToken: (login: string, password: string) => Chainable<string>;
  }
}
