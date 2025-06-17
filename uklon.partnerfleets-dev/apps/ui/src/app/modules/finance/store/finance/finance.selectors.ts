import { coerceNumberProperty } from '@angular/cdk/coercion';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CorePaths } from '@ui/core/models/core-paths';
import { getRouterUrl } from '@ui/core/store/router/router.selector';

import { FinanceState } from './finance.reducer';

export const getFinanceStore = createFeatureSelector<FinanceState>('finance');

export const getFleetWallet = createSelector(
  getFinanceStore,
  (financeStore: FinanceState) => financeStore?.fleetWallet,
);

export const fleetWalletBalance = createSelector(getFleetWallet, (wallet) =>
  coerceNumberProperty(wallet?.balance?.amount, 0),
);

export const fleetWalletCurrency = createSelector(getFleetWallet, (wallet) => wallet?.balance?.currency);

export const getFleetPaymentCard = createSelector(
  getFinanceStore,
  (financeStore: FinanceState) => financeStore?.paymentCard,
);

export const getFleetWalletTransactions = createSelector(
  getFinanceStore,
  (financeStore: FinanceState) => financeStore?.walletTransactionsCollection?.items,
);

export const getFleetWalletTransactionsHasMoreData = createSelector(
  getFinanceStore,
  (financeStore: FinanceState) => financeStore?.walletTransactionsCollection?.has_more_items,
);

export const isWalletTransactionsCollectionError = createSelector(
  getFinanceStore,
  (financeStore: FinanceState) => financeStore?.isWalletTransactionsCollectionError,
);

export const getFleetWalletTransactionsLoadingState = createSelector(
  getFinanceStore,
  (financeStore: FinanceState): 'progress' | 'done' => (financeStore.loading ? 'progress' : 'done'),
);

export const getDriverTransactions = createSelector(
  getFinanceStore,
  (financeStore: FinanceState) => financeStore?.driverTransactionsCollection?.items,
);

export const isDriverTransactionsCollectionError = createSelector(
  getFinanceStore,
  (financeStore: FinanceState) => financeStore?.isDriverTransactionsCollectionError,
);

export const getDriverTransactionsFilter = createSelector(
  getFinanceStore,
  (financeStore: FinanceState) => financeStore?.driverTransactionsFilter,
);

export const getDriverTransactionsLoadingState = createSelector(getFinanceStore, (financeStore: FinanceState) => ({
  hasNext: financeStore?.driverTransactionsCollection?.has_more_items || false,
  isLoaded: !financeStore?.loading,
}));

export const getDriversWithWallet = createSelector(
  getFinanceStore,
  (state: FinanceState) => state.driversWallets?.items || [],
);

export const hasDriversWithWalletError = createSelector(
  getFinanceStore,
  (financeStore: FinanceState) => financeStore?.isDriversWalletsError,
);

export const getTotalDriversBalance = createSelector(
  getFinanceStore,
  (financeStore: FinanceState) => financeStore?.driversWallets?.total_drivers_balance,
);

export const driversBalance = createSelector(getTotalDriversBalance, (balance) =>
  coerceNumberProperty(balance?.amount, 0),
);

export const driversCurrency = createSelector(getTotalDriversBalance, (balance) => balance?.currency);

export const driversFilter = createSelector(
  getFinanceStore,
  (financeStore: FinanceState) => financeStore?.driversWalletsFilter,
);

export const filteredDrivers = createSelector(getDriversWithWallet, driversFilter, (drivers, filter) => {
  if (drivers.length === 0) return [];
  const { name, phone: phoneFilter } = filter;
  const nameFilter = name?.toLowerCase();

  const hasNameFilter = nameFilter !== '';
  const hasPhoneFilter = phoneFilter !== '';

  if (!name && !phoneFilter) {
    return drivers;
  }

  return drivers.filter((driver) => {
    const firstName = driver.first_name?.toLowerCase();
    const lastName = driver.last_name?.toLowerCase();

    const hasFirstNameMatch = hasNameFilter ? firstName?.includes(nameFilter) : false;
    const hasLastNameMatch = hasNameFilter ? lastName?.includes(nameFilter) : false;
    const hasPhoneNumberMatch = hasPhoneFilter ? driver?.phone.includes(phoneFilter) : false;

    return hasFirstNameMatch || hasLastNameMatch || hasPhoneNumberMatch;
  });
});

export const getIsFinancePage = createSelector(getRouterUrl, (url: string) =>
  url?.includes(`/${CorePaths.WORKSPACE}/${CorePaths.FINANCE}`),
);
