import { AccountDto, CountryDto, FleetDto } from '@data-access';
import { createAction, props } from '@ngrx/store';

const tag = '[account]';

export const accountActions = {
  getAccountInfo: createAction(`${tag} get account info`),
  getAccountInfoSuccess: createAction(`${tag} get account info success`, props<AccountDto>()),
  getAccountInfoFailed: createAction(`${tag} get account info failed`),

  sendVerificationCode: createAction(`${tag} send verification code`),
  sendVerificationCodeSuccess: createAction(`${tag} send verification code success`),
  sendVerificationCodeFailed: createAction(`${tag} send verification code failed`),

  setSelectedFleet: createAction(`${tag} set account fleet`, props<FleetDto>()),
  setSelectedFleetFromMenu: createAction(`${tag} set account fleet from menu`, props<FleetDto>()),

  selectedCountrySupportWidget: createAction(`${tag} selected country for support widget`, props<CountryDto>()),
  selectedCountryPhoneNumber: createAction(`${tag} selected country for phone number`, props<CountryDto>()),
};
