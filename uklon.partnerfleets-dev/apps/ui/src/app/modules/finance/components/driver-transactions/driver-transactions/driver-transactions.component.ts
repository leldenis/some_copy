import { AsyncPipe } from '@angular/common';
import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { AnalyticsDateFilter, AnalyticsDriverBase, AnalyticsUserRole, FleetAnalyticsEventType } from '@data-access';
import { Store } from '@ngrx/store';
import { AnalyticsService } from '@ui/core/services/analytics.service';
import { StorageService, userRoleKey } from '@ui/core/services/storage.service';
import { DriverTransactionsFilterComponent } from '@ui/modules/finance/components/driver-transactions/driver-transactions-filter';
import { DriverTransactionsListComponent } from '@ui/modules/finance/components/driver-transactions/driver-transactions-list';
import { FINANCE_TRANSACTION_LIMIT, FINANCE_TRANSACTION_OFFSET } from '@ui/modules/finance/consts/finance';
import { TransactionsFiltersDto } from '@ui/modules/finance/models/fleet-wallet-transactions-filter.dto';
import {
  getDriverTransactions,
  isDriverTransactionsCollectionError,
  getDriverTransactionsLoadingState,
} from '@ui/modules/finance/store';
import { financeActions } from '@ui/modules/finance/store/finance/finance.actions';
import { FinanceState } from '@ui/modules/finance/store/finance/finance.reducer';
import { ProgressSpinnerComponent } from '@ui/shared';
import { EmptyStateComponent } from '@ui/shared/components/empty-state/empty-state.component';
import { EmptyStates } from '@ui/shared/components/empty-state/empty-states';
import { Observable } from 'rxjs';

import { ScrolledDirectiveModule } from '@uklon/fleets/angular/cdk';

@Component({
  selector: 'upf-driver-transactions',
  standalone: true,
  imports: [
    DriverTransactionsFilterComponent,
    DriverTransactionsListComponent,
    AsyncPipe,
    ScrolledDirectiveModule,
    EmptyStateComponent,
    ProgressSpinnerComponent,
  ],
  templateUrl: './driver-transactions.component.html',
  styleUrls: ['./driver-transactions.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DriverTransactionsComponent {
  @Input() public fleetId: string;

  public transactions$ = this.store.select(getDriverTransactions);
  public loadingState$ = this.store.select(getDriverTransactionsLoadingState);
  public isDriverTransactionsCollectionError$: Observable<boolean> = this.store.select(
    isDriverTransactionsCollectionError,
  );

  public readonly emptyState = EmptyStates;

  private filters: TransactionsFiltersDto;
  private offset = FINANCE_TRANSACTION_OFFSET;
  private readonly limit = FINANCE_TRANSACTION_LIMIT;

  constructor(
    private readonly store: Store<FinanceState>,
    private readonly analytics: AnalyticsService,
    private readonly storage: StorageService,
  ) {}

  public get driverId(): string {
    return this.filters?.driverId || '';
  }

  public get userRole(): string {
    return this.storage.get(userRoleKey) || '';
  }

  public onFiltersChange(filters: TransactionsFiltersDto): void {
    this.reportFiltersChanges({ ...filters });
    this.filters = filters;

    if (!filters.driverId) {
      this.store.dispatch(financeActions.clearTransactionsState());
      return;
    }

    this.offset = FINANCE_TRANSACTION_OFFSET;
    this.store.dispatch(
      financeActions.getDriverTransactions({
        ...filters,
        offset: this.offset,
        limit: this.limit,
      }),
    );
  }

  public onLoadNext(hasNext: boolean, isLoaded: boolean): void {
    if (!hasNext || !isLoaded) return;

    this.offset += this.limit;
    this.store.dispatch(
      financeActions.getDriverTransactionsWithNextPage({
        ...this.filters,
        offset: this.offset,
        limit: this.limit,
      }),
    );
  }

  public onFiltersReset(): void {
    this.filters = null;
    this.analytics.reportEvent<AnalyticsUserRole>(FleetAnalyticsEventType.DRIVER_TRANSACTIONS_FILTERS_CLEAR, {
      user_access: this.userRole,
    });
  }

  private reportFiltersChanges(filters: TransactionsFiltersDto): void {
    if (!this.filters) return;

    this.analytics.reportEvent<AnalyticsDateFilter | AnalyticsDriverBase>(
      FleetAnalyticsEventType.DRIVER_TRANSACTIONS_DATE_AND_DRIVER_FILTER,
      {
        user_access: this.userRole,
        start_date: filters.date.from,
        end_date: filters.date.to,
        driver_id: filters.driverId,
      },
    );
  }
}
