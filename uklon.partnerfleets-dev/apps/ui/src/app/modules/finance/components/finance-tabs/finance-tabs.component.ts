import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, Inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatTab, MatTabContent, MatTabGroup, MatTabLabel } from '@angular/material/tabs';
import { AnalyticsUserRole, FleetAnalyticsEventType, FleetRole } from '@data-access';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { AnalyticsService } from '@ui/core/services/analytics.service';
import { StorageService, userRoleKey } from '@ui/core/services/storage.service';
import { AccountState } from '@ui/core/store/account/account.reducer';
import * as accountSelectors from '@ui/core/store/account/account.selectors';
import { DriverBalancesComponent } from '@ui/modules/finance/components/driver-balances/driver-balances/driver-balances.component';
import { DriverTransactionsComponent } from '@ui/modules/finance/components/driver-transactions/driver-transactions';
import { FleetWalletComponent } from '@ui/modules/finance/components/fleet-wallet/fleet-wallet/fleet-wallet.component';
import { CashLimitsInfoDialogTriggerComponent } from '@ui/modules/finance/features/cash-limits/components';
import { CashLimitsContainerComponent } from '@ui/modules/finance/features/cash-limits/containers';
import { FinanceService } from '@ui/modules/finance/services';
import { NAMED_FRAGMENTS, NamedFragmentsDirective } from '@ui/shared';
import { IconsConfig } from '@ui/shared/tokens/icons.config';
import { ICONS } from '@ui/shared/tokens/icons.token';
import { EnvironmentModel, FeatureToggle } from '@ui-env/environment.model';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { of } from 'rxjs';
import { catchError, filter, map, switchMap } from 'rxjs/operators';

import { APP_CONFIG } from '@uklon/angular-core';

const TAB_INDEX_MAP: Record<number, FleetAnalyticsEventType> = {
  0: FleetAnalyticsEventType.FINANCE_FLEET_WALLET_SCREEN,
  1: FleetAnalyticsEventType.FINANCE_DRIVER_BALANCES_SCREEN,
  2: FleetAnalyticsEventType.DRIVER_TRANSACTIONS_BALANCES_SCREEN,
  3: FleetAnalyticsEventType.FINANCE_CASH_LIMITS_SCREEN,
};

enum FinanceTabs {
  WALLET,
  DRIVERS_WALLETS,
  TRANSACTION,
  CASH_LIMITS,
}

@Component({
  selector: 'upf-finance-tabs',
  standalone: true,
  imports: [
    InfiniteScrollDirective,
    AsyncPipe,
    MatTabGroup,
    MatTab,
    MatTabLabel,
    TranslateModule,
    FleetWalletComponent,
    MatTabContent,
    DriverBalancesComponent,
    DriverTransactionsComponent,
    CashLimitsContainerComponent,
    CashLimitsInfoDialogTriggerComponent,
  ],
  templateUrl: './finance-tabs.component.html',
  styleUrls: ['./finance-tabs.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NAMED_FRAGMENTS,
      useValue: ['wallet', 'wallets', 'transactions', 'cash-limits'],
    },
  ],
})
export class FinanceTabsComponent extends NamedFragmentsDirective {
  private readonly financeService = inject(FinanceService);
  private readonly appConfig = inject<EnvironmentModel>(APP_CONFIG);
  private readonly destroyRef = inject(DestroyRef);

  public readonly role$ = this.accountStore.select(accountSelectors.getSelectedFleetRole);
  public readonly fleet$ = this.accountStore.select(accountSelectors.getSelectedFleet);
  public readonly cashLimitsSettings$ = this.fleet$.pipe(
    filter(Boolean),
    switchMap(({ id }) => this.financeService.getCashLimitsSettings(id)),
    catchError(() => of(null)),
  );
  public readonly cashLimitsAvailableRegions$ = this.fleet$.pipe(
    filter(Boolean),
    map(({ region_id, id }) => {
      const regions = this.appConfig?.[FeatureToggle.CASH_LIMITS_REGIONS];
      const fleets = this.appConfig?.[FeatureToggle.CASH_LIMITS_FLEETS];

      if (!regions && !fleets) return true;
      if (regions && !fleets) return regions.includes(region_id);
      if (fleets && !regions) return fleets.includes(id);

      return regions.includes(region_id) && fleets.includes(id);
    }),
  );

  public readonly fleetRoleRef = FleetRole;
  public readonly financeTabs = FinanceTabs;

  constructor(
    protected readonly accountStore: Store<AccountState>,
    protected readonly analytics: AnalyticsService,
    protected readonly storage: StorageService,
    @Inject(ICONS) public icons: IconsConfig,
  ) {
    super();
    this.handleTabNavigation();
  }

  protected reportTabChange(index: number): void {
    const eventType = TAB_INDEX_MAP[index];

    this.analytics.reportEvent<AnalyticsUserRole>(eventType, {
      user_access: this.storage.get(userRoleKey) || '',
    });
  }

  protected handleTabNavigation(): void {
    this.navigatedToFragment$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((index) => this.reportTabChange(index));
  }
}
