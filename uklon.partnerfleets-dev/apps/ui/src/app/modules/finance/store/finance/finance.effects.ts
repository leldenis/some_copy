import { Injectable } from '@angular/core';
import {
  AnalyticsError,
  AnalyticsUserRole,
  DriverWalletsDto,
  FleetAnalyticsEventType,
  FleetDto,
  InfinityScrollCollectionDto,
  PaymentCardDto,
  TransactionDto,
  WalletDto,
} from '@data-access';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { AnalyticsService } from '@ui/core/services/analytics.service';
import { StorageService, userRoleKey } from '@ui/core/services/storage.service';
import { ToastService } from '@ui/core/services/toast.service';
import { accountActions } from '@ui/core/store/account/account.actions';
import { selectedFleetId } from '@ui/core/store/account/account.selectors';
import { AppState } from '@ui/core/store/app.state';
import { FinanceService } from '@ui/modules/finance/services/finance.service';
import { getIsFinancePage } from '@ui/modules/finance/store';
import { financeActions } from '@ui/modules/finance/store/finance/finance.actions';
import { FinanceState } from '@ui/modules/finance/store/finance/finance.reducer';
import { FleetErrorMessage } from '@ui/shared/enums';
import { exhaustMap, of } from 'rxjs';
import { switchMap, tap, catchError, withLatestFrom, filter } from 'rxjs/operators';

import { toServerDate } from '@uklon/angular-core';

@Injectable()
export class FinanceEffects {
  public getFleetWallet$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(financeActions.getFleetWallet),
        switchMap((payload) =>
          this.financeService.getFleetWallet(payload?.fleetId).pipe(
            tap((wallet: WalletDto) => {
              this.financeStore.dispatch(financeActions.getFleetWalletSuccess(wallet));
            }),
            catchError(() => {
              this.financeStore.dispatch(financeActions.getFleetWalletFailed());
              return of(null);
            }),
          ),
        ),
      ),
    { dispatch: false },
  );

  public putFleetPaymentCard$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(financeActions.putFleetPaymentCard),
        exhaustMap((payload) =>
          this.financeService.putFleetPaymentCard(payload?.fleetId, payload?.body).pipe(
            tap(() => {
              this.financeStore.dispatch(financeActions.putFleetPaymentCardSuccess());
              this.toastService.success('Notification.Finance.AddCardSuccess');
            }),
            catchError(({ error }) => {
              this.financeStore.dispatch(
                financeActions.putFleetPaymentCardFailed({ status: error.statusCode, message: error.message }),
              );

              this.toastService.error(
                error.message === FleetErrorMessage.DRIVER_PAYMENT_CARD_MANAGEMENT_FORBIDDEN
                  ? 'Notification.Finance.AddDeleteCardNotAllowed'
                  : 'Notification.Finance.AddCardFailed',
              );

              return of(null);
            }),
          ),
        ),
      ),
    { dispatch: false },
  );

  public putFleetPaymentCardSuccess$ = createEffect(
    () => this.actions$.pipe(ofType(financeActions.putFleetPaymentCardSuccess)),
    { dispatch: false },
  );

  public putFleetPaymentCardFailed$ = createEffect(
    () => this.actions$.pipe(ofType(financeActions.putFleetPaymentCardFailed)),
    { dispatch: false },
  );

  public getFleetPaymentCard$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(financeActions.getFleetPaymentCard),
        switchMap((payload) =>
          this.financeService.getFleetPaymentCard(payload?.fleetId).pipe(
            tap((paymentCard: PaymentCardDto) => {
              this.financeStore.dispatch(financeActions.getFleetPaymentCardSuccess(paymentCard));
            }),
            catchError(() => {
              this.financeStore.dispatch(financeActions.getFleetPaymentCardFailed());
              return of(null);
            }),
          ),
        ),
      ),
    { dispatch: false },
  );

  public deleteFleetPaymentCard$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(financeActions.deleteFleetPaymentCard),
        exhaustMap(({ fleetId, cardId }) =>
          this.financeService.deleteFleetPaymentCard(fleetId, cardId).pipe(
            tap(() => {
              this.financeStore.dispatch(financeActions.deleteFleetPaymentCardSuccess());
              this.financeStore.dispatch(financeActions.getFleetPaymentCardSuccess(null));
              this.toastService.success('Notification.Finance.DeleteCardSuccess');
              this.analytics.reportEvent<AnalyticsUserRole>(
                FleetAnalyticsEventType.FINANCE_FLEET_WALLET_REMOVE_CARD_SUCCESSFULL,
                {
                  user_access: this.userRole,
                },
              );
            }),
            catchError(({ error }) => {
              this.financeStore.dispatch(
                financeActions.deleteFleetPaymentCardFailed({ status: error.statusCode, message: error.message }),
              );
              this.analytics.reportEvent<AnalyticsError>(
                FleetAnalyticsEventType.FINANCE_FLEET_WALLET_REMOVE_CARD_ERROR,
                {
                  error_code: error.statusCode,
                  error_text: error.message,
                  user_access: this.userRole,
                },
              );

              this.toastService.error(
                error.message === FleetErrorMessage.DRIVER_PAYMENT_CARD_MANAGEMENT_FORBIDDEN
                  ? 'Notification.Finance.AddDeleteCardNotAllowed'
                  : 'Notification.Finance.DeleteCardFailed',
              );

              return of(null);
            }),
          ),
        ),
      ),
    { dispatch: false },
  );

  public withdrawToCard$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(financeActions.withdrawToCard),
        switchMap((payload) =>
          this.financeService.withdrawToCard(payload?.fleetId, payload?.transferId, payload?.body).pipe(
            tap(() => {
              this.financeStore.dispatch(financeActions.withdrawToCardSuccess());
            }),
            catchError(({ error }) => {
              this.financeStore.dispatch(
                financeActions.withdrawToCardFailed({ status: error.statusCode, message: error.message }),
              );

              this.analytics.reportEvent<AnalyticsError>(
                FleetAnalyticsEventType.FINANCE_FLEET_WALLET_WITHDRAW_MONEY_ERROR,
                {
                  error_code: error.statusCode,
                  error_text: error.message,
                  user_access: this.userRole,
                },
              );
              return of(null);
            }),
          ),
        ),
      ),
    { dispatch: false },
  );

  public withdrawToFleet$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(financeActions.withdrawToFleet),
        switchMap((payload) =>
          this.financeService.withdrawToFleet(payload?.fleetId, payload?.body).pipe(
            tap(() => {
              this.financeStore.dispatch(financeActions.withdrawToFleetSuccess());
            }),
            catchError(() => {
              this.financeStore.dispatch(financeActions.withdrawToFleetFailed());
              return of(null);
            }),
          ),
        ),
      ),
    { dispatch: false },
  );

  public withdrawToEmployees$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(financeActions.withdrawToEmployees),
        switchMap((payload) =>
          this.financeService.withdrawToEmployees(payload?.fleetId, payload?.body).pipe(
            tap(() => {
              this.financeStore.dispatch(financeActions.withdrawToEmployeesSuccess());
            }),
            catchError(() => {
              this.financeStore.dispatch(financeActions.withdrawToEmployeesFailed());
              return of(null);
            }),
          ),
        ),
      ),
    { dispatch: false },
  );

  public getFleetWalletTransactions$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(financeActions.getFleetWalletTransactions),
        withLatestFrom(this.store.select(selectedFleetId)),
        switchMap(([payload, fleetId]) =>
          this.financeService
            .getFleetWalletTransactions(fleetId, payload.date_from, payload.date_to, payload.offset, payload.limit)
            .pipe(
              tap((walletTransactionsCollection: InfinityScrollCollectionDto<TransactionDto>) => {
                this.financeStore.dispatch(
                  financeActions.getFleetWalletTransactionsSuccess(walletTransactionsCollection),
                );
              }),
              catchError(() => {
                this.financeStore.dispatch(financeActions.getFleetWalletTransactionsFailed());
                return of(null);
              }),
            ),
        ),
      ),
    { dispatch: false },
  );

  public getFleetWalletTransactionsWithNextPage$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(financeActions.getFleetWalletTransactionsWithNextPage),
        withLatestFrom(this.store.select(selectedFleetId)),
        switchMap(([payload, fleetId]) =>
          this.financeService
            .getFleetWalletTransactions(fleetId, payload.date_from, payload.date_to, payload.offset, payload.limit)
            .pipe(
              tap((walletTransactionsCollection: InfinityScrollCollectionDto<TransactionDto>) => {
                this.financeStore.dispatch(
                  financeActions.getFleetWalletTransactionsWithNextPageSuccess(walletTransactionsCollection),
                );
              }),
              catchError(() => {
                this.financeStore.dispatch(financeActions.getFleetWalletTransactionsWithNextPageFailed());
                return of(null);
              }),
            ),
        ),
      ),
    { dispatch: false },
  );

  public getDriverTransactions$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(financeActions.getDriverTransactions),
        withLatestFrom(this.store.select(selectedFleetId)),
        switchMap(([payload, fleetId]) =>
          this.financeService
            .getEmployeeTransactions(
              fleetId,
              payload.driverId,
              toServerDate(new Date(payload.date.from)),
              toServerDate(new Date(payload.date.to)),
              payload.offset,
              payload.limit,
            )
            .pipe(
              tap((driverTransactionsCollection: InfinityScrollCollectionDto<TransactionDto>) => {
                this.financeStore.dispatch(financeActions.getDriverTransactionsSuccess(driverTransactionsCollection));
              }),
              catchError(() => {
                this.financeStore.dispatch(financeActions.getDriverTransactionsFailed());
                return of(null);
              }),
            ),
        ),
      ),
    { dispatch: false },
  );

  public getDriverTransactionsWithNextPage$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(financeActions.getDriverTransactionsWithNextPage),
        withLatestFrom(this.store.select(selectedFleetId)),
        switchMap(([payload, fleetId]) =>
          this.financeService
            .getEmployeeTransactions(
              fleetId,
              payload.driverId,
              toServerDate(new Date(payload.date.from)),
              toServerDate(new Date(payload.date.to)),
              payload.offset,
              payload.limit,
            )
            .pipe(
              tap((driverTransactionsCollection: InfinityScrollCollectionDto<TransactionDto>) => {
                this.financeStore.dispatch(
                  financeActions.getDriverTransactionsWithNextPageSuccess(driverTransactionsCollection),
                );
              }),
              catchError(() => {
                this.financeStore.dispatch(financeActions.getDriverTransactionsWithNextPageFailed());
                return of(null);
              }),
            ),
        ),
      ),
    { dispatch: false },
  );

  public getDriversWallets$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(financeActions.getDriversWallets),
        switchMap((payload) =>
          this.financeService.getDriversWallets(payload.fleetId).pipe(
            tap((driverWallets: DriverWalletsDto) => {
              this.financeStore.dispatch(financeActions.getDriversWalletsSuccess(driverWallets));
            }),
            catchError(() => {
              this.financeStore.dispatch(financeActions.getDriversWalletsFailed());
              return of(null);
            }),
          ),
        ),
      ),
    { dispatch: false },
  );

  public setDriverWalletsFilter$ = createEffect(
    () => this.actions$.pipe(ofType(financeActions.setDriverWalletsFilter)),
    { dispatch: false },
  );

  public clearDriverWalletsFilter$ = createEffect(
    () => this.actions$.pipe(ofType(financeActions.clearDriverWalletsFilter)),
    { dispatch: false },
  );

  public setSelectedFleetFromMenu$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(accountActions.setSelectedFleetFromMenu),
        withLatestFrom(this.store.select(getIsFinancePage)),
        filter(([_, isFinancePage]: [FleetDto, boolean]) => isFinancePage),
        tap(([fleet, _]: [FleetDto, boolean]) => {
          this.store.dispatch(accountActions.setSelectedFleet(fleet));
        }),
      ),
    { dispatch: false },
  );

  constructor(
    private readonly actions$: Actions,
    private readonly store: Store<AppState>,
    private readonly financeService: FinanceService,
    private readonly financeStore: Store<FinanceState>,
    private readonly toastService: ToastService,
    private readonly storage: StorageService,
    private readonly analytics: AnalyticsService,
  ) {}

  private get userRole(): string {
    return this.storage.get(userRoleKey) || '';
  }
}
