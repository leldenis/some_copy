import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, Inject, OnDestroy } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AnalyticsUserRole, FleetAnalyticsEventType, FleetDto } from '@data-access';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { AnalyticsService } from '@ui/core/services/analytics.service';
import { StorageService, userRoleKey } from '@ui/core/services/storage.service';
import { AccountState } from '@ui/core/store/account/account.reducer';
import * as accountSelectors from '@ui/core/store/account/account.selectors';
import { OrderReportsComponent } from '@ui/modules/orders/features/order-reports/containers/order-reports/order-reports.component';
import { TripsComponent } from '@ui/modules/orders/features/trips/containers/trips/trips.component';
import { VehicleOrderReportsComponent } from '@ui/modules/orders/features/vehicle-order-reports/containers/vehicle-order-reports/vehicle-order-reports.component';
import { OrdersFeatureActionGroup } from '@ui/modules/orders/store/actions/orders.actions';
import { OrdersFeatureState } from '@ui/modules/orders/store/reducers/orders.reducer';
import { NamedFragmentsDirective, NAMED_FRAGMENTS, MAT_TAB_IMPORTS } from '@ui/shared';
import { IconsConfig } from '@ui/shared/tokens/icons.config';
import { ICONS } from '@ui/shared/tokens/icons.token';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { filter, map } from 'rxjs/operators';

const ANALYTICS_EVENT_TYPE = [
  FleetAnalyticsEventType.ORDER_REPORT_SCREEN,
  FleetAnalyticsEventType.ORDER_TRIPS_SCREEN,
  FleetAnalyticsEventType.VEHICLES_REPORTS_SCREEN,
] as const;

@Component({
  selector: 'upf-orders-tabs',
  standalone: true,
  imports: [
    MAT_TAB_IMPORTS,
    InfiniteScrollDirective,
    AsyncPipe,
    TranslateModule,
    OrderReportsComponent,
    TripsComponent,
    VehicleOrderReportsComponent,
  ],
  templateUrl: './orders-tabs.component.html',
  styleUrls: ['./orders-tabs.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NAMED_FRAGMENTS,
      useValue: ['drivers-reports', 'trips', 'vehicles-reports'],
    },
  ],
})
export class OrdersTabsComponent extends NamedFragmentsDirective implements OnDestroy {
  public fleetId$ = this.accountStore.select(accountSelectors.getSelectedFleet).pipe(
    filter((fleet: FleetDto) => coerceBooleanProperty(fleet)),
    map((fleet) => fleet.id),
  );

  constructor(
    private readonly accountStore: Store<AccountState>,
    private readonly ordersStore: Store<OrdersFeatureState>,
    private readonly analytics: AnalyticsService,
    private readonly storage: StorageService,
    private readonly destroyRef: DestroyRef,
    @Inject(ICONS) public icons: IconsConfig,
  ) {
    super();
    this.handleTabNavigation();
  }

  public ngOnDestroy(): void {
    this.ordersStore.dispatch(OrdersFeatureActionGroup.clear());
  }

  private reportTabChange(index: number): void {
    const eventType = ANALYTICS_EVENT_TYPE[index];

    this.analytics.reportEvent<AnalyticsUserRole>(eventType, {
      user_access: this.storage.get(userRoleKey),
    });
  }

  private handleTabNavigation(): void {
    this.navigatedToFragment$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((index) => this.reportTabChange(index));
  }
}
