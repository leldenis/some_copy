import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { AnalyticsService } from '@ui/core/services/analytics.service';
import { StorageFiltersKey, StorageService } from '@ui/core/services/storage.service';
import { AccountState } from '@ui/core/store/account/account.reducer';
import { CourierTransactionsContainerComponent } from '@ui/modules/couriers-finance/features/courier-transactions/containers/courier-transactions-container/courier-transactions-container.component';
import { CouriersWalletsContainerComponent } from '@ui/modules/couriers-finance/features/couriers-wallets/containers/couriers-wallets-container/couriers-wallets-container.component';
import { FinanceTabsComponent } from '@ui/modules/finance/components/finance-tabs/finance-tabs.component';
import { FleetWalletComponent } from '@ui/modules/finance/components/fleet-wallet/fleet-wallet/fleet-wallet.component';
import { MAT_TAB_IMPORTS, NAMED_FRAGMENTS } from '@ui/shared';
import { IconsConfig } from '@ui/shared/tokens/icons.config';
import { ICONS } from '@ui/shared/tokens/icons.token';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';

@Component({
  selector: 'upf-couriers-finance-container',
  standalone: true,
  imports: [
    MAT_TAB_IMPORTS,
    AsyncPipe,
    InfiniteScrollDirective,
    TranslateModule,
    FleetWalletComponent,
    CouriersWalletsContainerComponent,
    CourierTransactionsContainerComponent,
  ],
  templateUrl: './couriers-finance-container.component.html',
  styleUrls: ['./couriers-finance-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NAMED_FRAGMENTS,
      useValue: ['wallet', 'wallets', 'transactions'],
    },
  ],
})
export class CouriersFinanceContainerComponent extends FinanceTabsComponent {
  public readonly filterKey = StorageFiltersKey.COURIERS_FLEET_WALLET;

  constructor(
    protected override readonly accountStore: Store<AccountState>,
    protected override readonly analytics: AnalyticsService,
    protected override readonly storage: StorageService,
    @Inject(ICONS) public override icons: IconsConfig,
  ) {
    super(accountStore, analytics, storage, icons);
  }
}
