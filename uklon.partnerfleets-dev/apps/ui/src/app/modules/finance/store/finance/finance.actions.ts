import {
  AddPaymentCardDto,
  DriverWalletsDto,
  InfinityScrollCollectionDto,
  MoneyDto,
  PaymentCardDto,
  TransactionDto,
  WalletDto,
  WalletTransferDto,
} from '@data-access';
import { createAction, props } from '@ngrx/store';
import { DriverTransactionsFilterDto } from '@ui/modules/finance/models/driver-tx-filter.dto';
import { EmployeeWalletsFilterDto } from '@ui/modules/finance/models/employee-wallets-filter.dto';
import { FleetWalletTransactionsFilterDto } from '@ui/modules/finance/models/fleet-wallet-transactions-filter.dto';

const tag = '[finance]';

export const financeActions = {
  getFleetWallet: createAction(
    `${tag} get fleet wallet`,
    props<{
      fleetId: string;
    }>(),
  ),
  getFleetWalletSuccess: createAction(`${tag} get fleet wallet success`, props<WalletDto>()),
  getFleetWalletFailed: createAction(`${tag} get fleet wallet failed`),

  putFleetPaymentCard: createAction(
    `${tag} put fleet payment card`,
    props<{
      fleetId: string;
      body: AddPaymentCardDto;
    }>(),
  ),
  putFleetPaymentCardSuccess: createAction(`${tag} put fleet payment card success`),
  putFleetPaymentCardFailed: createAction(
    `${tag} put fleet payment card failed`,
    props<{ status: number; message?: string }>(),
  ),

  getFleetPaymentCard: createAction(
    `${tag} get fleet payment card`,
    props<{
      fleetId: string;
    }>(),
  ),
  getFleetPaymentCardSuccess: createAction(`${tag} get fleet payment card success`, props<PaymentCardDto>()),
  getFleetPaymentCardFailed: createAction(`${tag} get fleet payment card failed`),

  deleteFleetPaymentCard: createAction(
    `${tag} delete fleet payment card`,
    props<{
      fleetId: string;
      cardId: string;
    }>(),
  ),
  deleteFleetPaymentCardSuccess: createAction(`${tag} delete fleet payment card success`),
  deleteFleetPaymentCardFailed: createAction(
    `${tag} delete fleet payment card failed`,
    props<{ status: number; message?: string }>(),
  ),

  withdrawToCard: createAction(
    `${tag} withdraw to card`,
    props<{
      fleetId: string;
      transferId: string;
      body: MoneyDto;
    }>(),
  ),
  withdrawToCardSuccess: createAction(`${tag} withdraw to card success`),
  withdrawToCardFailed: createAction(`${tag} withdraw to card failed`, props<{ status: number; message?: string }>()),

  withdrawToFleet: createAction(
    `${tag} withdraw to fleet`,
    props<{
      fleetId: string;
      body: WalletTransferDto;
    }>(),
  ),
  withdrawToFleetSuccess: createAction(`${tag} withdraw to fleet success`),
  withdrawToFleetFailed: createAction(`${tag} withdraw to fleet failed`),

  withdrawToEmployees: createAction(
    `${tag} withdraw to employees`,
    props<{
      fleetId: string;
      body: WalletTransferDto;
    }>(),
  ),
  withdrawToEmployeesSuccess: createAction(`${tag} withdraw to employees success`),
  withdrawToEmployeesFailed: createAction(`${tag} withdraw to employees failed`),

  getFleetWalletTransactions: createAction(
    `${tag} get fleet wallet transactions`,
    props<{
      date_from?: number;
      date_to?: number;
      limit?: number;
      offset?: number;
    }>(),
  ),
  getFleetWalletTransactionsSuccess: createAction(
    `${tag} get fleet wallet transactions success`,
    props<InfinityScrollCollectionDto<TransactionDto>>(),
  ),
  getFleetWalletTransactionsFailed: createAction(`${tag} get fleet wallet transactions failed`),

  getFleetWalletTransactionsWithNextPage: createAction(
    `${tag} get fleet wallet transactions with next page`,
    props<{
      date_from?: number;
      date_to?: number;
      limit?: number;
      offset?: number;
    }>(),
  ),
  getFleetWalletTransactionsWithNextPageSuccess: createAction(
    `${tag} get fleet wallet transactions with next page success`,
    props<InfinityScrollCollectionDto<TransactionDto>>(),
  ),
  getFleetWalletTransactionsWithNextPageFailed: createAction(
    `${tag} get fleet wallet transactions with next page failed`,
  ),

  setFleetWalletTransactionsFilter: createAction(
    `${tag} set fleet wallet transactions filter`,
    props<FleetWalletTransactionsFilterDto>(),
  ),
  getFleetWalletTransactionsFilter: createAction(`${tag} get fleet wallet transactions filter`),
  clearFleetWalletTransactionsFilter: createAction(`${tag} clear fleet wallet transactions filter`),

  getDriverTransactions: createAction(`${tag} get driver transactions`, props<DriverTransactionsFilterDto>()),
  getDriverTransactionsSuccess: createAction(
    `${tag} get driver transactions success`,
    props<InfinityScrollCollectionDto<TransactionDto>>(),
  ),
  getDriverTransactionsFailed: createAction(`${tag} get driver transactions failed`),

  getDriverTransactionsWithNextPage: createAction(
    `${tag} get driver transactions with next page`,
    props<DriverTransactionsFilterDto>(),
  ),
  getDriverTransactionsWithNextPageSuccess: createAction(
    `${tag} get driver transactions with next page success`,
    props<InfinityScrollCollectionDto<TransactionDto>>(),
  ),
  getDriverTransactionsWithNextPageFailed: createAction(`${tag} get driver transactions with next page failed`),

  getDriversWallets: createAction(
    `${tag} get drivers wallets`,
    props<{
      fleetId: string;
    }>(),
  ),
  getDriversWalletsSuccess: createAction(`${tag} get drivers wallets success`, props<DriverWalletsDto>()),
  getDriversWalletsFailed: createAction(`${tag} get drivers wallets failed`),

  setDriverWalletsFilter: createAction(`${tag} set driver wallets filter`, props<EmployeeWalletsFilterDto>()),
  getDriverWalletsFilter: createAction(`${tag} get driver wallets filter`),
  clearDriverWalletsFilter: createAction(`${tag} clear driver wallets filter`),

  clearState: createAction(`${tag} clear drivers state`),
  clearTransactionsState: createAction(`${tag} clear drivers transactions state`),
};
