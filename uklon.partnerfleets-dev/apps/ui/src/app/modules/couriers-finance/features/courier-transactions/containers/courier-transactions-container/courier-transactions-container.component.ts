import { BreakpointObserver } from '@angular/cdk/layout';
import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TransactionDto } from '@data-access';
import { CourierTransactionsFiltersComponent } from '@ui/modules/couriers-finance/features/courier-transactions/components/courier-transactions-filters/courier-transactions-filters.component';
import { CourierTransactionsListComponent } from '@ui/modules/couriers-finance/features/courier-transactions/components/courier-transactions-list/courier-transactions-list.component';
import { CourierTransactionsFiltersDto } from '@ui/modules/couriers-finance/models/courier-finance.dto';
import { FinanceService } from '@ui/modules/finance/services';
import { UIService } from '@ui/shared';
import { EmptyStateComponent } from '@ui/shared/components/empty-state/empty-state.component';
import { EmptyStates } from '@ui/shared/components/empty-state/empty-states';
import { BehaviorSubject, Observable, combineLatest, filter, finalize, map, switchMap } from 'rxjs';

import { toServerDate } from '@uklon/angular-core';
import { ScrolledDirectiveModule } from '@uklon/fleets/angular/cdk';

@Component({
  selector: 'upf-courier-transactions-container',
  standalone: true,
  imports: [
    AsyncPipe,
    CourierTransactionsFiltersComponent,
    CourierTransactionsListComponent,
    ScrolledDirectiveModule,
    EmptyStateComponent,
  ],
  templateUrl: './courier-transactions-container.component.html',
  styleUrls: ['./courier-transactions-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CourierTransactionsContainerComponent {
  @Input() public set fleetId(id: string) {
    this.offset = 0;
    this.fleetId$.next(id);
    this.loadNext$.next(false);
  }

  public offset = 0;
  public hasNext: boolean;
  public isLoading: boolean;

  public readonly emptyState = EmptyStates;
  public readonly fleetId$ = new BehaviorSubject<string>(null);
  public readonly loadNext$ = new BehaviorSubject<boolean>(false);
  public readonly filters$ = new BehaviorSubject<CourierTransactionsFiltersDto>(null);
  public readonly isMobileView$ = this.uiService.breakpointMatch();
  public readonly transaction$: Observable<TransactionDto[]> = combineLatest([
    this.filters$,
    this.fleetId$,
    this.loadNext$,
  ]).pipe(
    filter(([filters]) => !!filters?.courierId),
    switchMap(([filters, fleetId, loadNext]) => this.getTransactions(filters, fleetId, loadNext)),
  );

  private transactions: TransactionDto[];
  private readonly limit = 30;

  constructor(
    private readonly financeService: FinanceService,
    private readonly observer: BreakpointObserver,
    private readonly uiService: UIService,
  ) {}

  public onLoadNext(): void {
    if (!this.hasNext || this.isLoading) return;

    this.offset += this.limit;
    this.loadNext$.next(true);
  }

  private getTransactions(
    { dateRange: { from, to }, courierId }: CourierTransactionsFiltersDto,
    fleetId: string,
    loadNext: boolean,
  ): Observable<TransactionDto[]> {
    this.isLoading = true;

    return this.financeService
      .getEmployeeTransactions(
        fleetId,
        courierId,
        toServerDate(new Date(from)),
        toServerDate(new Date(to)),
        this.offset,
        this.limit,
      )
      .pipe(
        map(({ items, has_more_items }) => {
          this.hasNext = has_more_items;
          this.transactions = loadNext ? [...this.transactions, ...items] : items;
          return this.transactions;
        }),
        finalize(() => {
          this.isLoading = false;
        }),
      );
  }
}
