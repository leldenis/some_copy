import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { MatDivider } from '@angular/material/divider';
import { MatIcon } from '@angular/material/icon';
import { MatSort } from '@angular/material/sort';
import { EmployeeWalletItemDto, WalletTransferDto } from '@data-access';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { StorageFiltersKey } from '@ui/core/services/storage.service';
import { getSelectedFleet } from '@ui/core/store/account/account.selectors';
import { CouriersBalancesInfoComponent } from '@ui/modules/couriers-finance/features/couriers-wallets/components/couriers-balances-info/couriers-balances-info.component';
import { CouriersWalletsListComponent } from '@ui/modules/couriers-finance/features/couriers-wallets/components/couriers-wallets-list/couriers-wallets-list.component';
import { DriverBalancesFilterComponent } from '@ui/modules/finance/components/driver-balances/driver-balances-filter/driver-balances-filter.component';
import { BalanceChangeDto } from '@ui/modules/finance/models';
import { EmployeeWalletsFilterDto } from '@ui/modules/finance/models/employee-wallets-filter.dto';
import { FinanceService } from '@ui/modules/finance/services';
import { financeActions, getFleetWallet } from '@ui/modules/finance/store';
import { TO_FILTER_FORMAT } from '@ui/shared';
import { EmptyStateComponent } from '@ui/shared/components/empty-state/empty-state.component';
import { EmptyStates } from '@ui/shared/components/empty-state/empty-states';
import { WithdrawToDriversComponent } from '@ui/shared/dialogs/withdraw-to-drivers/withdraw-to-drivers.component';
import { WithdrawToFleetComponent } from '@ui/shared/dialogs/withdraw-to-fleet/withdraw-to-fleet.component';
import { ICONS } from '@ui/shared/tokens';
import { BehaviorSubject, combineLatest, filter, forkJoin, map, switchMap } from 'rxjs';
import { tap } from 'rxjs/operators';

const DIALOG_CONFIG = {
  disableClose: true,
  panelClass: 'confirmation-modal',
  autoFocus: false,
};

@Component({
  selector: 'upf-couriers-wallets-container',
  standalone: true,
  imports: [
    AsyncPipe,
    CouriersBalancesInfoComponent,
    DriverBalancesFilterComponent,
    MatButton,
    TranslateModule,
    CouriersWalletsListComponent,
    EmptyStateComponent,
    MatIcon,
    MatDivider,
  ],
  templateUrl: './couriers-wallets-container.component.html',
  styleUrls: ['./couriers-wallets-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CouriersWalletsContainerComponent {
  public withdrawalSum = 0;
  public fleetCurrency: string;
  public insufficientFunds: boolean;
  public balanceChange: BalanceChangeDto;
  public withdrawEverythingEnabled: boolean;

  public readonly emptyState = EmptyStates;
  public readonly filterKey = StorageFiltersKey.COURIERS_WALLETS;

  public readonly icons = inject(ICONS);
  public readonly financeService = inject(FinanceService);
  public readonly store = inject(Store);
  public readonly dialog = inject(MatDialog);

  public readonly filteredWallets$ = new BehaviorSubject<EmployeeWalletItemDto[]>([]);
  public readonly sort$ = new BehaviorSubject<Partial<MatSort>>({ direction: '', active: 'Balance' });
  public readonly walletsUpdated$ = new BehaviorSubject<void>(null);
  public readonly fleetId$ = this.store.select(getSelectedFleet).pipe(
    filter(Boolean),
    map(({ id }) => id),
  );
  public readonly fleetBalance$ = this.store.select(getFleetWallet).pipe(
    filter(Boolean),
    map(({ balance }) => {
      this.fleetCurrency = balance.currency;
      return balance.amount / 100 || 0;
    }),
  );

  public readonly couriersWallets$ = combineLatest([this.fleetId$, this.walletsUpdated$]).pipe(
    switchMap(([id]) =>
      forkJoin({
        wallets: this.financeService.getEmployeesWallets(id, this.limit, this.cursor),
        totalBalance: this.financeService.getEmployeeWalletsTotalBalance(id),
      }),
    ),
    tap(({ wallets }) => {
      this.filteredWallets$.next(wallets.items);
    }),
  );

  private readonly limit = 900;
  private readonly cursor = -1;

  public onSortChange(sort: Partial<MatSort>, wallets: EmployeeWalletItemDto[]): void {
    this.filteredWallets$.next(this.sortWallets(wallets, sort));
  }

  public onFiltersChange(filters: { name: string; phone: string }, wallets: EmployeeWalletItemDto[]): void {
    this.filteredWallets$.next(this.filterWallets(wallets, filters));
  }

  public onBalancesChange(balanceChange: BalanceChangeDto): void {
    this.balanceChange = balanceChange;
    this.insufficientFunds = balanceChange.changes.some(
      ({ amount }, index) => amount && amount > this.filteredWallets$.value[index].wallet.balance.amount,
    );
  }

  public handleWithdrawToFleetClick(maxAmount: number, fleetId: string): void {
    const balanceChange = {
      ...this.balanceChange,
      total: this.balanceChange.changes.reduce((acc, { amount }, index) => {
        const avaliable = this.filteredWallets$.value[index].wallet.balance.amount;
        return acc + (avaliable >= amount ? amount : 0);
      }, 0),
      maxAmount,
    };

    const dialogRef: MatDialogRef<WithdrawToFleetComponent, WalletTransferDto> = this.dialog.open(
      WithdrawToFleetComponent,
      {
        ...DIALOG_CONFIG,
        data: { balanceChange, currency: this.fleetCurrency },
      },
    );

    dialogRef
      .afterClosed()
      .pipe(
        filter(Boolean),
        map(({ items }) => ({ items: items.filter(({ amount: { amount } }) => amount) })),
        switchMap((transferData) => this.financeService.withdrawToFleet(fleetId, transferData)),
      )
      .subscribe(() => this.onTransactionComplete(fleetId));
  }

  public handleWithdrawToCouriersClick(maxAmount: number, fleetId: string): void {
    const balanceChange = {
      ...this.balanceChange,
      changes: this.balanceChange.changes.filter(({ amount }) => amount),
      maxAmount,
    };

    const dialogRef: MatDialogRef<WithdrawToDriversComponent, WalletTransferDto> = this.dialog.open(
      WithdrawToDriversComponent,
      {
        ...DIALOG_CONFIG,
        data: { balanceChange, currency: this.fleetCurrency, isCourier: true },
      },
    );

    dialogRef
      .afterClosed()
      .pipe(
        filter(Boolean),
        switchMap((transferData) => this.financeService.withdrawToEmployees(fleetId, transferData)),
      )
      .subscribe(() => this.onTransactionComplete(fleetId));
  }

  private onTransactionComplete(fleetId: string): void {
    this.withdrawalSum = 0;
    this.walletsUpdated$.next();
    this.store.dispatch(financeActions.getFleetWallet({ fleetId }));
  }

  private sortWallets(
    wallets: EmployeeWalletItemDto[],
    { active, direction }: Partial<MatSort>,
  ): EmployeeWalletItemDto[] {
    if (!active || direction === '') return wallets;

    const sortedWallets = [...wallets];
    sortedWallets.sort(
      (a, b) =>
        (direction === 'asc' ? a : b).wallet.balance.amount - (direction === 'asc' ? b : a).wallet.balance.amount,
    );
    return sortedWallets;
  }

  private filterWallets(
    wallets: EmployeeWalletItemDto[],
    { phone, name }: EmployeeWalletsFilterDto,
  ): EmployeeWalletItemDto[] {
    if (!name && !phone) return wallets;

    return [...wallets].filter(({ first_name, last_name, phone: courierPhone }) => {
      const fullName = TO_FILTER_FORMAT(`${last_name}${first_name}`);
      return (
        fullName.includes(TO_FILTER_FORMAT(name)) && TO_FILTER_FORMAT(courierPhone).includes(TO_FILTER_FORMAT(phone))
      );
    });
  }
}
