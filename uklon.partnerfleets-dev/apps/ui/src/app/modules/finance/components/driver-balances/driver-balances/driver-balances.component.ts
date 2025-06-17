import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, ViewChild } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatSort } from '@angular/material/sort';
import {
  AnalyticsDriversWalletsFilter,
  AnalyticsUserRole,
  EmployeeWalletItemDto,
  FleetAnalyticsEventType,
  WalletTransferDto,
  FleetDto,
} from '@data-access';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { AnalyticsService } from '@ui/core/services/analytics.service';
import { StorageFiltersKey, StorageService, userRoleKey } from '@ui/core/services/storage.service';
import { getSelectedFleet } from '@ui/core/store/account/account.selectors';
import { DriverBalancesFilterComponent } from '@ui/modules/finance/components/driver-balances/driver-balances-filter/driver-balances-filter.component';
import { DriverBalancesInfoComponent } from '@ui/modules/finance/components/driver-balances/driver-balances-info/driver-balances-info.component';
import { DriverBalancesListComponent } from '@ui/modules/finance/components/driver-balances/driver-balances-list/driver-balances-list.component';
import { EmployeeWalletsFilterDto } from '@ui/modules/finance/models/employee-wallets-filter.dto';
import { financeActions } from '@ui/modules/finance/store/finance/finance.actions';
import * as financeSelectors from '@ui/modules/finance/store/finance/finance.selectors';
import { EmptyStateComponent } from '@ui/shared/components/empty-state/empty-state.component';
import { EmptyStates } from '@ui/shared/components/empty-state/empty-states';
import { WithdrawToDriversComponent } from '@ui/shared/dialogs/withdraw-to-drivers/withdraw-to-drivers.component';
import { WithdrawToFleetComponent } from '@ui/shared/dialogs/withdraw-to-fleet/withdraw-to-fleet.component';
import { ICONS } from '@ui/shared/tokens';
import { BehaviorSubject, combineLatest, filter, map, Observable, of, switchMap, tap } from 'rxjs';

import { BalanceChangeDto, WithdrawalChangeDto } from '../../../models';

@Component({
  selector: 'upf-driver-balances',
  standalone: true,
  imports: [
    DriverBalancesInfoComponent,
    AsyncPipe,
    DriverBalancesFilterComponent,
    TranslateModule,
    MatButton,
    DriverBalancesListComponent,
    EmptyStateComponent,
    MatIcon,
  ],
  templateUrl: './driver-balances.component.html',
  styleUrls: ['./driver-balances.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DriverBalancesComponent {
  @ViewChild(DriverBalancesListComponent)
  private readonly driverBalancesListComponent: DriverBalancesListComponent;

  public readonly emptyStatesRef = EmptyStates;

  public readonly icons = inject(ICONS);
  public readonly store = inject(Store);
  public readonly dialog = inject(MatDialog);
  public readonly analytics = inject(AnalyticsService);
  public readonly storage = inject(StorageService);

  public readonly fleet$: Observable<FleetDto> = this.store.select(getSelectedFleet).pipe(
    filter(Boolean),
    tap(({ id }) => {
      this.store.dispatch(financeActions.getFleetWallet({ fleetId: id }));
      this.store.dispatch(financeActions.getDriversWallets({ fleetId: id }));
    }),
  );
  public sort$ = new BehaviorSubject<Partial<MatSort>>({ direction: '', active: 'Balance' });
  public driversBalance$ = this.store.select(financeSelectors.driversBalance);
  public driversCurrency$ = this.store
    .select(financeSelectors.driversCurrency)
    .pipe(switchMap((currency) => (currency ? of(currency) : this.fleetCurrency$)));
  public fleetBalance$ = this.store.select(financeSelectors.fleetWalletBalance);
  public fleetCurrency$ = this.store.select(financeSelectors.fleetWalletCurrency);
  public drivers$ = combineLatest([this.store.select(financeSelectors.filteredDrivers), this.sort$]).pipe(
    map(([drivers, sort]) => this.sortDrivers(drivers, sort)),
  );
  public filter$ = this.store.select(financeSelectors.driversFilter).pipe(
    tap((filters) => {
      this.filters = filters;
    }),
  );
  public hasError$ = this.store.select(financeSelectors.hasDriversWithWalletError);
  public withdrawalAmount = 0;
  public canWithdrawToFleetBalance = false;
  public canWithdrawToDriversBalances = false;
  public readonly analyticsEventType = FleetAnalyticsEventType;
  public readonly filterKey = StorageFiltersKey.DRIVER_BALANCE;

  private readonly panelClass = 'confirmation-modal';

  private fleetBalanceChange: BalanceChangeDto;
  private driversBalancesChange: BalanceChangeDto;
  private filters: EmployeeWalletsFilterDto;

  public get userRole(): string {
    return this.storage.get(userRoleKey) || '';
  }

  public onFilterApply(filters: EmployeeWalletsFilterDto): void {
    this.reportFiltersChange(filters);
    this.store.dispatch(financeActions.setDriverWalletsFilter(filters));
  }

  public handleWithdrawalChange(change: WithdrawalChangeDto | undefined): void {
    if (!change) return;
    this.setWithdrawalChange(change);
  }

  public handleWithdrawToFleetClick(currency: string, fleetId: string): void {
    this.reportUserRole(FleetAnalyticsEventType.FINANCE_DRIVER_BALANCES_REPLENISH_BALANCE_POPUP);

    const dialogRef = this.dialog.open(WithdrawToFleetComponent, {
      disableClose: true,
      panelClass: this.panelClass,
      autoFocus: false,
      data: { balanceChange: this.fleetBalanceChange, currency },
    });

    dialogRef
      .afterClosed()
      .pipe(
        tap((confirmed) => {
          if (confirmed) return;
          this.reportUserRole(FleetAnalyticsEventType.FINANCE_DRIVER_BALANCES_REPLENISH_BALANCE_POPUP_CANCEL);
        }),
        filter(Boolean),
      )
      .subscribe((walletTransferData: WalletTransferDto) => {
        this.reportUserRole(FleetAnalyticsEventType.FINANCE_DRIVER_BALANCES_REPLENISH_BALANCET_POPUP_CONFIRM);
        this.resetWithdrawalChange();
        this.store.dispatch(
          financeActions.withdrawToFleet({
            fleetId,
            body: walletTransferData,
          }),
        );
        this.driverBalancesListComponent.markAsPristine();
      });
  }

  public handleWithdrawToDriversClick(currency: string, fleetId: string): void {
    this.reportUserRole(FleetAnalyticsEventType.FINANCE_DRIVER_BALANCES_TRANSFER_TO_WALLET_POPUP);

    const dialogRef = this.dialog.open(WithdrawToDriversComponent, {
      disableClose: true,
      panelClass: this.panelClass,
      autoFocus: false,
      data: { balanceChange: this.driversBalancesChange, currency },
    });

    dialogRef
      .afterClosed()
      .pipe(
        tap((confirmed) => {
          if (confirmed) return;
          this.reportUserRole(FleetAnalyticsEventType.FINANCE_DRIVER_BALANCES_TRANSFER_TO_WALLET_POPUP_CANCEL);
        }),
        filter(Boolean),
      )
      .subscribe((walletTransferData: WalletTransferDto) => {
        this.reportUserRole(FleetAnalyticsEventType.FINANCE_DRIVER_BALANCES_TRANSFER_TO_WALLET_POPUP_CONFIRM);
        this.resetWithdrawalChange();
        this.store.dispatch(
          financeActions.withdrawToEmployees({
            fleetId,
            body: walletTransferData,
          }),
        );
        this.driverBalancesListComponent.markAsPristine();
      });
  }

  public reportUserRole(eventType: FleetAnalyticsEventType): void {
    this.analytics.reportEvent<AnalyticsUserRole>(eventType, {
      user_access: this.userRole,
    });
  }

  public onSortChange({ direction, active }: Partial<MatSort>): void {
    this.sort$.next({ direction, active });
  }

  private setWithdrawalChange(change: WithdrawalChangeDto): void {
    this.fleetBalanceChange = change?.toFleet;
    this.driversBalancesChange = change?.toDrivers;
    this.toggleWithdrawalButtons();
    this.setWithdrawalAmount(change?.total);
  }

  private resetWithdrawalChange(): void {
    this.setWithdrawalChange({
      total: 0,
      toFleet: null,
      toDrivers: null,
    });
  }

  private toggleWithdrawalButtons(): void {
    this.canWithdrawToDriversBalances = this.getCanWithdrawFromBalance(this.driversBalancesChange);
    this.canWithdrawToFleetBalance = this.getCanWithdrawFromBalance(this.fleetBalanceChange);
  }

  private setWithdrawalAmount(value: number): void {
    if (this.canWithdrawToDriversBalances && this.canWithdrawToFleetBalance) {
      this.withdrawalAmount = value;
    } else if (this.canWithdrawToFleetBalance) {
      this.withdrawalAmount = this.fleetBalanceChange.total;
    } else if (this.canWithdrawToDriversBalances) {
      this.withdrawalAmount = this.driversBalancesChange.total;
    } else {
      this.withdrawalAmount = 0;
    }
  }

  private getCanWithdrawFromBalance(change: BalanceChangeDto): boolean {
    return change?.changes?.length > 0 && change?.total <= change?.maxAmount;
  }

  private reportFiltersChange(filters: EmployeeWalletsFilterDto): void {
    const changedProperty = (Object.keys(filters) as (keyof EmployeeWalletsFilterDto)[]).find(
      (key) => filters[key] !== this.filters[key] || '',
    );
    const filtersEmpty = Object.values(filters).every((value) => !value);

    if (!changedProperty || filtersEmpty || !filters[changedProperty]) return;
    const eventType =
      changedProperty === 'name'
        ? FleetAnalyticsEventType.FINANCE_DRIVER_BALANCES_NAME_FILTER
        : FleetAnalyticsEventType.FINANCE_DRIVER_BALANCES_PHONE_FILTER;

    this.analytics.reportEvent<AnalyticsDriversWalletsFilter>(eventType, {
      user_access: this.userRole,
      [changedProperty]: filters[changedProperty],
    });
  }

  private sortDrivers(
    drivers: EmployeeWalletItemDto[],
    { active, direction }: Partial<MatSort>,
  ): EmployeeWalletItemDto[] {
    if (!active || direction === '') return drivers;

    const sortedDrivers = [...drivers];
    sortedDrivers.sort(
      (a, b) =>
        (direction === 'asc' ? a : b).wallet.balance.amount - (direction === 'asc' ? b : a).wallet.balance.amount,
    );
    return sortedDrivers;
  }
}
