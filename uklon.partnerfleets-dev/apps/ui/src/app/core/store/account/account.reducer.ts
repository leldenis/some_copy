import { AccountDto, FleetDto } from '@data-access';
import { createReducer, on } from '@ngrx/store';
import { accountActions } from '@ui/core/store/account/account.actions';

export interface AccountState {
  loading: boolean;
  accountInfo: AccountDto;
  selectedFleet: FleetDto;
  userCountry: string;
  selectedCountrySupportWidget: string;
  selectedCountryPhoneNumber: string;
}

export const initialState: AccountState = {
  loading: false,
  accountInfo: null,
  selectedFleet: null,
  userCountry: null,
  selectedCountrySupportWidget: null,
  selectedCountryPhoneNumber: null,
};

export const accountReducer = createReducer(
  initialState,

  on(accountActions.getAccountInfo, (state) => ({
    ...state,
    loading: true,
  })),

  on(accountActions.getAccountInfoSuccess, (state, accountInfo) => ({
    ...state,
    loading: false,
    accountInfo,
  })),

  on(accountActions.getAccountInfoFailed, () => ({
    ...initialState,
  })),

  on(accountActions.setSelectedFleet, (state, fleet) => ({
    ...state,
    selectedFleet: fleet,
  })),

  on(accountActions.selectedCountrySupportWidget, (state, payload) => ({
    ...state,
    selectedCountrySupportWidget: payload.country,
  })),

  on(accountActions.selectedCountryPhoneNumber, (state, payload) => ({
    ...state,
    selectedCountryPhoneNumber: payload.country,
  })),
);
