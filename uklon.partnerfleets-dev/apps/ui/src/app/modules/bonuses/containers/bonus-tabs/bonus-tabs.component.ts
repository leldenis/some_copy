import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatTab, MatTabContent, MatTabGroup, MatTabLabel } from '@angular/material/tabs';
import { CommissionProgramType } from '@constant';
import { AnalyticsUserRole, FleetAnalyticsEventType, FleetDataDto } from '@data-access';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { AnalyticsService } from '@ui/core/services/analytics.service';
import { StorageFiltersKey, StorageService, userRoleKey } from '@ui/core/services/storage.service';
import { AccountState } from '@ui/core/store/account/account.reducer';
import { getFleetData, selectedFleetId } from '@ui/core/store/account/account.selectors';
import { BrandingBonusContainerComponent } from '@ui/modules/bonuses/containers/branding-bonus-container/branding-bonus-container.component';
import { BrandingBonusOldContainerComponent } from '@ui/modules/bonuses/containers/branding-bonus-old-container/branding-bonus-old-container.component';
import { DriverCommissionProgramsComponent } from '@ui/modules/bonuses/containers/driver-commission-programs/driver-commission-programs.component';
import { VehicleCommissionProgramsComponent } from '@ui/modules/bonuses/containers/vehicle-commission-programs/vehicle-commission-programs.component';
import { BonusOldService } from '@ui/modules/bonuses/services/bonus-old.service';
import { FinanceService } from '@ui/modules/finance/services';
import { DurationPipe, NAMED_FRAGMENTS, NamedFragmentsDirective, UIService } from '@ui/shared';
import { DEFAULT_LIMIT } from '@ui/shared/consts';
import { IconsConfig } from '@ui/shared/tokens/icons.config';
import { ICONS } from '@ui/shared/tokens/icons.token';
import { EnvironmentModel } from '@ui-env/environment.model';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { NgxTippyModule } from 'ngx-tippy-wrapper';
import { BehaviorSubject, filter, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { APP_CONFIG } from '@uklon/angular-core';

enum BonusTab {
  DRIVER_COMMISSION = 2,
  VEHICLE_COMMISSION,
}

@Component({
  selector: 'upf-bonus-tabs',
  standalone: true,
  templateUrl: './bonus-tabs.component.html',
  styleUrls: ['./bonus-tabs.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NAMED_FRAGMENTS,
      useValue: ['branding-bonus-old', 'branding-bonus', 'driver-commissions', 'vehicle-commissions'],
    },
    DurationPipe,
  ],
  imports: [
    InfiniteScrollDirective,
    MatTabGroup,
    AsyncPipe,
    MatTab,
    MatTabLabel,
    BrandingBonusOldContainerComponent,
    MatTabContent,
    DriverCommissionProgramsComponent,
    TranslateModule,
    MatIcon,
    NgxTippyModule,
    VehicleCommissionProgramsComponent,
    BrandingBonusContainerComponent,
  ],
})
export class BonusTabsComponent extends NamedFragmentsDirective implements OnInit, OnDestroy {
  public readonly bonusTab = BonusTab;
  public readonly walletId$ = new BehaviorSubject('');

  public readonly calculationPeriods$ = this.store.select(selectedFleetId).pipe(
    filter(Boolean),
    switchMap((fleetId) => this.financeService.getFleetWallet(fleetId)),
    map(({ id }) => {
      this.walletId$.next(id);
      return id;
    }),
    switchMap((walletId) =>
      this.bonusOldService.getBrandingBonusCalculationPeriods({
        wallet_id: walletId,
        offset: 0,
        limit: DEFAULT_LIMIT,
      }),
    ),
  );
  public readonly fleetData$: Observable<FleetDataDto> = this.store.select(getFleetData);

  public readonly appConfig = inject<EnvironmentModel>(APP_CONFIG);

  constructor(
    private readonly store: Store<AccountState>,
    private readonly bonusOldService: BonusOldService,
    private readonly financeService: FinanceService,
    private readonly uiService: UIService,
    private readonly analytics: AnalyticsService,
    private readonly storage: StorageService,
    @Inject(ICONS) public icons: IconsConfig,
  ) {
    super();
  }

  public ngOnInit(): void {
    this.uiService.setConfig({
      header: {
        title: true,
        backNavigationButton: false,
      },
    });

    this.analytics.reportEvent<AnalyticsUserRole>(FleetAnalyticsEventType.BONUSES_VEHICLES_PAGE, {
      user_access: this.storage.get(userRoleKey),
    });
  }

  public ngOnDestroy(): void {
    this.uiService.resetConfig();
  }

  public reportAnalytics(): void {
    this.analytics.reportEvent(FleetAnalyticsEventType.COMMISSION_PROGRAMS_WHAT_IS_IT, {
      user_access: this.storage.get(userRoleKey),
      active_tab: this.storage.get(StorageFiltersKey.DRIVER_ACTIVE_COMMISSION_TAB) || CommissionProgramType.ACTIVE,
    });
  }
}
