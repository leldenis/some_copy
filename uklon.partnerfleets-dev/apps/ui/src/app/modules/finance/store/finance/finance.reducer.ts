import {
  DriverWalletsDto,
  getCurrentWeek,
  InfinityScrollCollectionDto,
  PaymentCardDto,
  TransactionDto,
  WalletDto,
} from '@data-access';
import { createReducer, on } from '@ngrx/store';
import {
  FINANCE_BALANCE_TAB,
  FINANCE_TRANSACTION_LIMIT,
  FINANCE_TRANSACTION_OFFSET,
  FINANCE_TRANSACTIONS_TAB,
} from '@ui/modules/finance/consts/finance';
import { DriverTransactionsFilterDto } from '@ui/modules/finance/models/driver-tx-filter.dto';
import { EmployeeWalletsFilterDto } from '@ui/modules/finance/models/employee-wallets-filter.dto';
import { FleetWalletTransactionsFilterDto } from '@ui/modules/finance/models/fleet-wallet-transactions-filter.dto';
import { financeActions } from '@ui/modules/finance/store/finance/finance.actions';

export interface FinanceState {
  loading: boolean;
  fleetWallet: WalletDto;
  paymentCard: PaymentCardDto;
  walletTransactionsCollection: InfinityScrollCollectionDto<TransactionDto>;
  isWalletTransactionsCollectionError: boolean;
  filter: FleetWalletTransactionsFilterDto;
  driverTransactionsCollection: InfinityScrollCollectionDto<TransactionDto>;
  isDriverTransactionsCollectionError: boolean;
  driverTransactionsFilter: DriverTransactionsFilterDto;
  driversWallets: DriverWalletsDto;
  isDriversWalletsError: boolean;
  driversWalletsFilter: EmployeeWalletsFilterDto;
}

export const DEFAULT_TRANSACTION_FILTER = {
  date: getCurrentWeek(true),
  driverId: '',
  offset: FINANCE_TRANSACTION_OFFSET,
  limit: FINANCE_TRANSACTION_LIMIT,
  isReset: true,
};

const DEFAULT_WALLETS_FILTER = {
  name: '',
  phone: '',
};

export const initialState: FinanceState = {
  loading: false,
  fleetWallet: null,
  paymentCard: null,
  walletTransactionsCollection: {
    has_more_items: false,
    items: [],
  },
  isWalletTransactionsCollectionError: false,
  filter: {
    dateRange: getCurrentWeek(),
    offset: 0,
    limit: 30,
    isReset: true,
  },
  driverTransactionsCollection: {
    has_more_items: false,
    items: [],
  },
  isDriverTransactionsCollectionError: false,
  driverTransactionsFilter: JSON.parse(sessionStorage.getItem(FINANCE_TRANSACTIONS_TAB)) || DEFAULT_TRANSACTION_FILTER,
  driversWallets: null,
  isDriversWalletsError: false,
  driversWalletsFilter: JSON.parse(sessionStorage.getItem(FINANCE_BALANCE_TAB)) || DEFAULT_WALLETS_FILTER,
};

export const financeReducer = createReducer(
  initialState,

  on(financeActions.getFleetWallet, (state) => ({
    ...state,
    loading: true,
  })),

  on(financeActions.getFleetWalletSuccess, (state, fleetWallet) => ({
    ...state,
    loading: false,
    fleetWallet,
  })),

  on(financeActions.getFleetWalletFailed, (state) => ({
    ...state,
    fleetWallet: {
      ...initialState.fleetWallet,
    },
  })),

  on(financeActions.putFleetPaymentCard, (state) => ({
    ...state,
    loading: true,
  })),

  on(financeActions.putFleetPaymentCardSuccess, financeActions.putFleetPaymentCardFailed, (state) => ({
    ...state,
    loading: false,
  })),

  on(financeActions.getFleetPaymentCard, (state) => ({
    ...state,
    loading: true,
  })),

  on(financeActions.getFleetPaymentCardSuccess, (state, paymentCard) => ({
    ...state,
    loading: false,
    paymentCard,
  })),

  on(financeActions.getFleetPaymentCardFailed, (state) => ({
    ...state,
    paymentCard: null,
  })),

  on(financeActions.deleteFleetPaymentCard, (state) => ({
    ...state,
    loading: true,
  })),

  on(financeActions.deleteFleetPaymentCardSuccess, (state) => ({
    ...state,
    paymentCard: null,
    loading: false,
  })),

  on(financeActions.deleteFleetPaymentCardFailed, (state) => ({
    ...state,
    loading: false,
  })),

  on(financeActions.withdrawToCard, (state) => ({
    ...state,
    loading: true,
  })),

  on(financeActions.withdrawToCardSuccess, financeActions.withdrawToCardFailed, (state) => ({
    ...state,
    loading: false,
  })),

  on(financeActions.withdrawToFleet, (state) => ({
    ...state,
    loading: true,
  })),

  on(financeActions.withdrawToFleetSuccess, financeActions.withdrawToFleetFailed, (state) => ({
    ...state,
    loading: false,
  })),

  on(financeActions.getFleetWalletTransactions, (state) => ({
    ...state,
    loading: true,
    isWalletTransactionsCollectionError: false,
  })),

  on(financeActions.getFleetWalletTransactionsSuccess, (state, walletTransactionsCollection) => ({
    ...state,
    loading: false,
    walletTransactionsCollection,
  })),

  on(financeActions.getFleetWalletTransactionsFailed, (state) => ({
    ...state,
    walletTransactionsCollection: {
      ...initialState.walletTransactionsCollection,
    },
    isWalletTransactionsCollectionError: true,
  })),

  on(financeActions.getFleetWalletTransactionsWithNextPage, (state) => ({
    ...state,
    loading: true,
  })),

  on(financeActions.getFleetWalletTransactionsWithNextPageSuccess, (state, walletTransactionsCollection) => ({
    ...state,
    loading: false,
    walletTransactionsCollection: {
      has_more_items: walletTransactionsCollection?.has_more_items,
      items: [...state.walletTransactionsCollection.items, ...walletTransactionsCollection.items],
    },
  })),

  on(financeActions.getFleetWalletTransactionsWithNextPageFailed, (state) => ({
    ...state,
    walletTransactionsCollection: {
      ...initialState.walletTransactionsCollection,
    },
  })),

  on(financeActions.setFleetWalletTransactionsFilter, (state, walletTransactionsFilter) => ({
    ...state,
    loading: false,
    walletTransactionsFilter: {
      ...walletTransactionsFilter,
      isReset: false,
    },
  })),

  on(financeActions.getFleetWalletTransactionsFilter, (state) => ({
    ...state,
  })),

  on(financeActions.clearFleetWalletTransactionsFilter, (state) => ({
    ...state,
    walletTransactionsFilter: {
      ...initialState.filter,
    },
  })),

  on(financeActions.getDriverTransactions, (state) => ({
    ...state,
    loading: true,
    isDriverTransactionsCollectionError: false,
  })),

  on(financeActions.getDriverTransactionsSuccess, (state, driverTransactionsCollection) => ({
    ...state,
    loading: false,
    driverTransactionsCollection: {
      ...driverTransactionsCollection,
    },
  })),

  on(financeActions.getDriverTransactionsFailed, (state) => ({
    ...state,
    driverTransactionsCollection: {
      ...initialState.driverTransactionsCollection,
    },
    isDriverTransactionsCollectionError: true,
  })),

  on(financeActions.getDriverTransactionsWithNextPage, (state) => ({
    ...state,
    loading: true,
  })),

  on(financeActions.getDriverTransactionsWithNextPageSuccess, (state, driverTransactionsCollection) => ({
    ...state,
    loading: false,
    driverTransactionsCollection: {
      has_more_items: driverTransactionsCollection?.has_more_items,
      items: [...state.driverTransactionsCollection.items, ...driverTransactionsCollection.items],
    },
  })),

  on(financeActions.getDriverTransactionsWithNextPageFailed, (state) => ({
    ...state,
    driverTransactionsCollection: {
      ...initialState.driverTransactionsCollection,
    },
  })),

  on(financeActions.getDriversWallets, (state) => ({
    ...state,
    loading: true,
    isDriversWalletsError: false,
  })),

  on(financeActions.getDriversWalletsSuccess, (state, driversWallets) => ({
    ...state,
    loading: false,
    driversWallets: {
      ...driversWallets,
      items: driversWallets.items,
    },
  })),

  on(financeActions.getDriversWalletsFailed, (state) => ({
    ...state,
    driversWallets: {
      ...initialState.driversWallets,
    },
    isDriversWalletsError: true,
  })),

  on(financeActions.setDriverWalletsFilter, (state, driversWalletsFilter) => ({
    ...state,
    loading: false,
    driversWalletsFilter: {
      ...driversWalletsFilter,
    },
  })),

  on(financeActions.getDriverWalletsFilter, (state) => ({
    ...state,
  })),

  on(financeActions.clearDriverWalletsFilter, (state) => ({
    ...state,
    driversWalletsFilter: {
      ...DEFAULT_WALLETS_FILTER,
    },
  })),

  on(financeActions.clearState, () => ({
    ...initialState,
  })),

  on(financeActions.clearTransactionsState, (state) => ({
    ...state,
    driverTransactionsCollection: {
      ...initialState.driverTransactionsCollection,
    },
  })),
);
