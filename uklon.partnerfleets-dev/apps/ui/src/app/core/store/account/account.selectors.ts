import { BlockedListStatusValue } from '@constant';
import { AccountDto, FleetDataDto, FleetDto, FleetRole, RegionDictionaryItemDto } from '@data-access';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CorePaths } from '@ui/core/models/core-paths';
import { AccountState } from '@ui/core/store/account/account.reducer';
import { getRegions as allRegios } from '@ui/core/store/references/references.selectors';
import { getConfig, getRROEnabled, getSupportWidget } from '@ui/core/store/root/root.selectors';
import { getRouterUrl } from '@ui/core/store/router/router.selector';

import { Currency } from '@uklon/types';

export const getAccountStore = createFeatureSelector<AccountState>('account');

export const account = createSelector(getAccountStore, (accountStore: AccountState) => accountStore?.accountInfo);

export const isBlockedFleet = createSelector(
  account,
  (accountInfo: AccountDto) => accountInfo?.status?.value === BlockedListStatusValue.BLOCKED,
);

export const getSelectedFleet = createSelector(getAccountStore, (store) => store.selectedFleet);

export const selectedFleetId = createSelector(getSelectedFleet, (selectedFleet: FleetDto) => selectedFleet?.id);

export const selectedFleetRegionId = createSelector(getSelectedFleet, (selectedFleet) => selectedFleet?.region_id);

export const getRegion = createSelector(
  [getSelectedFleet, allRegios],
  (selectedFleet: FleetDto, regions: RegionDictionaryItemDto[]) => {
    if (!selectedFleet || !regions) {
      return null;
    }

    return regions.find((item) => selectedFleet.region_id === item.id);
  },
);

export const getSelectedFleetCurrency = createSelector(getRegion, (region) => region?.currency || Currency.UAH);

export const getFleetData = createSelector(
  getSelectedFleet,
  getSelectedFleetCurrency,
  (fleet, currency): FleetDataDto => ({
    id: fleet.id,
    region_id: fleet.region_id,
    currency,
  }),
);

export const getSelectedFleetRole = createSelector(
  getAccountStore,
  (accountStore: AccountState) => accountStore?.selectedFleet?.role,
);

export const getUserCountry = createSelector(getAccountStore, (state: AccountState) => state?.userCountry);

export const getAccountSupportWidget = createSelector(
  getSupportWidget,
  getAccountStore,
  (supportWidget, state) => supportWidget[state.selectedCountrySupportWidget || state.userCountry],
);

export const getSelectedCountryPhoneNumber = createSelector(
  getAccountStore,
  (state) => state.selectedCountryPhoneNumber || state.userCountry,
);

export const getIsAccountPage = createSelector(getRouterUrl, (url: string) =>
  url?.includes(`/${CorePaths.WORKSPACE}/${CorePaths.ACCOUNT}`),
);

export const getRROAvailable = createSelector(getRROEnabled, getSelectedFleet, (rroEnabled, selectedFleet) => {
  return rroEnabled && selectedFleet?.is_fiscalization_enabled && selectedFleet.role === FleetRole.OWNER;
});

export const getVehicleBrandingPeriodAvailable = createSelector(
  getConfig,
  selectedFleetRegionId,
  (config, currentRegionId) =>
    currentRegionId && config?.vehicleBrandingPeriodAvailableRegions?.includes(currentRegionId),
);
