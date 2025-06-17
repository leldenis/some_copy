import { AsyncPipe, NgClass, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, Inject, signal, ViewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatIcon } from '@angular/material/icon';
import { MatDrawer, MatDrawerContainer, MatDrawerContent, MatDrawerMode } from '@angular/material/sidenav';
import { NavigationStart, Router, RouterOutlet } from '@angular/router';
import {
  AccountDto,
  AnalyticsFleetName,
  AnalyticsNotifications,
  FleetAnalyticsEventType,
  FleetDto,
  FleetType,
} from '@data-access';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { FleetService } from '@ui/core';
import { CorePaths } from '@ui/core/models/core-paths';
import { AnalyticsService } from '@ui/core/services/analytics.service';
import { NotificationsService } from '@ui/core/services/notifications.service';
import { StorageFiltersKey, StorageService } from '@ui/core/services/storage.service';
import { accountActions } from '@ui/core/store/account/account.actions';
import { AccountState } from '@ui/core/store/account/account.reducer';
import { account, getSelectedFleet, getRROAvailable, isBlockedFleet } from '@ui/core/store/account/account.selectors';
import { authActions } from '@ui/core/store/auth/auth.actions';
import { RootState } from '@ui/core/store/root/root.reducer';
import { ProfileIndicatorService } from '@ui/modules/fleet-profile/features/fleet-rro/services';
import {
  ShellFleetSelectorComponent,
  ShellHeaderComponent,
  ShellLanguageSelectorComponent,
} from '@ui/modules/shell/components';
import { ShellNavigationComponent } from '@ui/modules/shell/components/shell-navigation/shell-navigation.component';
import { FLEET_TYPE_ROUTES, AVAILABLE_PAGE_FOR_REDIRECT } from '@ui/modules/shell/consts';
import { DynamicComponentSidebarDirective } from '@ui/modules/shell/directives/dynamic-component-sidebar.directive';
import { HasScrollDirective, UIService } from '@ui/shared';
import { COURIER_FLEET_TYPES, VEHICLE_FLEET_TYPES } from '@ui/shared/consts';
import { LetDirective } from '@ui/shared/directives/let.directive';
import { NavigationRouteDto } from '@ui/shared/models';
import { EnvironmentModel } from '@ui-env/environment.model';
import {
  combineLatest,
  filter,
  map,
  Observable,
  pairwise,
  shareReplay,
  startWith,
  Subject,
  switchMap,
  tap,
} from 'rxjs';

import { APP_CONFIG } from '@uklon/angular-core';

@Component({
  selector: 'upf-shell',
  standalone: true,
  imports: [
    MatIcon,
    MatDrawer,
    MatDrawerContent,
    MatDrawerContainer,
    RouterOutlet,
    NgClass,
    NgTemplateOutlet,
    AsyncPipe,
    LetDirective,
    HasScrollDirective,
    ShellHeaderComponent,
    ShellNavigationComponent,
    ShellFleetSelectorComponent,
    ShellLanguageSelectorComponent,
    DynamicComponentSidebarDirective,
    TranslateModule,
  ],
  templateUrl: './shell.component.html',
  styleUrl: './shell.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShellComponent {
  @ViewChild('drawer')
  public readonly mainDrawer: MatDrawer;

  public readonly fleetSelectorOpened$ = new Subject<void>();
  public readonly isMobileView$ = this.uiService.breakpointMatch('640px').pipe(
    tap((matches) => {
      this.mode.set(matches ? 'over' : 'side');
      this.drawerOpened.set(matches);
    }),
  );
  public readonly isBlockedFleet$: Observable<boolean> = this.store.select(isBlockedFleet);
  public readonly account$ = this.store.select(account).pipe(filter(Boolean));
  public readonly fleet$ = this.store.select(getSelectedFleet).pipe(
    filter(Boolean),
    startWith(null),
    pairwise(),
    tap(([prev, current]) => this.handleFleetTypeChange(prev?.fleet_type, current?.fleet_type)),
    map(([_, current]: [FleetDto, FleetDto]) => current),
  );
  public readonly fleetDetails$ = this.fleet$.pipe(switchMap(({ id }) => this.fleetService.getFleetById(id)));
  public readonly fleets$ = this.account$.pipe(map((accountData: AccountDto) => accountData.fleets));
  public readonly title$ = this.uiService.title$;
  public readonly config$ = this.uiService.config$;
  public readonly fullScreen$ = this.uiService.fullscreen$;
  public readonly unreadCount$ = this.notificationsService.unreadCount$;
  public readonly unreadCustomCount$ = this.notificationsService.unreadCustomCount$;
  public readonly notificationsCount$ = this.fleetSelectorOpened$.pipe(
    takeUntilDestroyed(),
    filter(() => Boolean(this.appConfig?.notifications?.showNotificationCenter)),
    switchMap(() => this.fleets$),
    map((fleets: FleetDto[]) => fleets.map(({ id }) => id)),
    switchMap((ids: string[]) => this.notificationsService.getMultipleFleetsUnreadNotificationsCount(ids)),
    shareReplay(1),
  );
  public readonly showRROIndicator$: Observable<boolean> = combineLatest([
    this.store.select(getRROAvailable),
    this.indicatorService.showIndicator$,
  ]).pipe(map(([rroAvailable, showIndicator]) => rroAvailable && showIndicator));

  public readonly drawerOpened = signal<boolean>(false);
  public readonly mode = signal<MatDrawerMode>('side');
  public readonly routes = signal<NavigationRouteDto[]>([]);

  constructor(
    private readonly router: Router,
    private readonly uiService: UIService,
    private readonly destroyRef: DestroyRef,
    private readonly fleetService: FleetService,
    private readonly analytics: AnalyticsService,
    private readonly storageService: StorageService,
    private readonly store: Store<AccountState | RootState>,
    private readonly indicatorService: ProfileIndicatorService,
    private readonly notificationsService: NotificationsService,
    @Inject(APP_CONFIG) public readonly appConfig: EnvironmentModel,
  ) {
    this.closeSidebarOnNavigate();
  }

  public openNotificationsSidebar(unread: number): void {
    this.analytics.reportEvent<AnalyticsNotifications>(FleetAnalyticsEventType.NOTIFICATIONS_ICON_CLICK, { unread });
    this.notificationsService.openNotificationsSidenav();
  }

  public onNavigation(page_name: string, isMobileView: boolean): void {
    this.analytics.reportEvent(FleetAnalyticsEventType.SIDEBAR_MENU_NAVIGATION, { page_name });
    isMobileView ? this.mainDrawer.close() : this.drawerOpened.set(false);
  }

  public onLogout(): void {
    this.store.dispatch(authActions.logout());
  }

  public reportSidebarToggle(opened: boolean): void {
    this.analytics.reportEvent(FleetAnalyticsEventType.SIDEBAR_TOGGLE, {
      user_access: JSON.parse(localStorage.getItem('userRole')),
      view: opened ? 'Closed' : 'Opened',
    });
  }

  public reportLanguageSelect(): void {
    this.analytics.reportEvent(FleetAnalyticsEventType.SIDEBAR_OPEN_LANGUAGE_MENU);
  }

  public onSelectFleet(fleet: FleetDto): void {
    // select fleet and redirect to main page
    if (AVAILABLE_PAGE_FOR_REDIRECT.some((page) => this.router.url.includes(page))) {
      this.store.dispatch(accountActions.setSelectedFleetFromMenu(fleet));
    } else {
      // select fleet without redirect
      this.store.dispatch(accountActions.setSelectedFleet(fleet));
    }

    // remove all saved filters when change fleet
    Object.entries(StorageFiltersKey).forEach(([_, value]) => this.storageService.delete(value));

    this.analytics.reportEvent<AnalyticsFleetName>(FleetAnalyticsEventType.SIDEBAR_FLEET_CHANGED, {
      fleet_name: fleet.name,
    });
  }

  private closeSidebarOnNavigate(): void {
    this.router.events
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        filter((event) => event instanceof NavigationStart),
        switchMap(() => this.isMobileView$),
      )
      .subscribe((isMobileView) => {
        isMobileView ? this.mainDrawer.close() : this.drawerOpened.set(false);
      });
  }

  private handleFleetTypeChange(prevType: FleetType, currentType: FleetType): void {
    if (!prevType && !currentType) return;

    if (!prevType) {
      this.routes.set(FLEET_TYPE_ROUTES.get(currentType));
      return;
    }

    const sameFleetType =
      VEHICLE_FLEET_TYPES.has(prevType) === VEHICLE_FLEET_TYPES.has(currentType) ||
      COURIER_FLEET_TYPES.has(prevType) === COURIER_FLEET_TYPES.has(currentType);

    if (sameFleetType) {
      this.router.navigate([], { preserveFragment: true }); // Reset query params
      return;
    }

    const path = COURIER_FLEET_TYPES.has(currentType)
      ? ['/', CorePaths.WORKSPACE, CorePaths.COURIERS]
      : ['/', CorePaths.WORKSPACE, CorePaths.GENERAL];

    if (!this.router.url.includes('fleet-profile')) this.router.navigate(path);
    this.routes.set(FLEET_TYPE_ROUTES.get(currentType));
  }
}
