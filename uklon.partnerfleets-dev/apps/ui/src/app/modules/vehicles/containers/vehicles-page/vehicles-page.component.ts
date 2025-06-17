import { AsyncPipe } from '@angular/common';
import { Component, ChangeDetectionStrategy, Inject, inject, signal, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { FleetAnalyticsEventType, AnalyticsUserRole } from '@data-access';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { AnalyticsService } from '@ui/core/services/analytics.service';
import { StorageService, userRoleKey } from '@ui/core/services/storage.service';
import { AccountState } from '@ui/core/store/account/account.reducer';
import { selectedFleetId, getVehicleBrandingPeriodAvailable } from '@ui/core/store/account/account.selectors';
import { VehicleTicketsComponent } from '@ui/modules/vehicles/components/vehicle-tickets/vehicle-tickets/vehicle-tickets.component';
import { VehicleBrandingPeriodTicketsContainerComponent } from '@ui/modules/vehicles/features/vehicle-branding-period-tickets/containers';
import { VehiclesWrapComponent } from '@ui/modules/vehicles/features/vehicles/containers/vehicles-wrap/vehicles-wrap.component';
import { VehiclePhotoControlListContainerComponent } from '@ui/modules/vehicles/features/vehilce-photo-control-list/containers/vehicle-photo-control-list-container/vehicle-photo-control-list-container.component';
import {
  CountMaskPipe,
  IndicatorComponent,
  MAT_TAB_IMPORTS,
  NAMED_FRAGMENTS,
  NamedFragmentsDirective,
} from '@ui/shared';
import { paginationActions } from '@ui/shared/components/pagination/store/pagination.actions';
import { PaginationState } from '@ui/shared/components/pagination/store/pagination.reducer';
import { CanDeactivateComponent } from '@ui/shared/models';
import { IconsConfig } from '@ui/shared/tokens/icons.config';
import { ICONS } from '@ui/shared/tokens/icons.token';
import { EnvironmentModel } from '@ui-env/environment.model';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { Observable, filter, map, switchMap } from 'rxjs';

import { APP_CONFIG } from '@uklon/angular-core';

import { TicketsService } from '../../services/tickets.service';

const TAB_ANALYTICS_TYPE = [
  FleetAnalyticsEventType.VEHICLES_LIST_SCREEN,
  FleetAnalyticsEventType.VEHICLES_REQUESTS_LIST_SCREEN,
  FleetAnalyticsEventType.FLEET_PHOTO_CONTROL_LIST_SCREEN,
] as const;

@Component({
  selector: 'upf-vehicles-page',
  standalone: true,
  imports: [
    MAT_TAB_IMPORTS,
    InfiniteScrollDirective,
    AsyncPipe,
    TranslateModule,
    VehiclesWrapComponent,
    IndicatorComponent,
    VehiclePhotoControlListContainerComponent,
    MatProgressSpinner,
    CountMaskPipe,
    VehicleBrandingPeriodTicketsContainerComponent,
    VehicleTicketsComponent,
  ],
  templateUrl: './vehicles-page.component.html',
  styleUrls: ['./vehicles-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NAMED_FRAGMENTS,
      useValue: ['list', 'tickets', 'photo-control', 'vehicle-branding-tickets'],
    },
  ],
})
export class VehiclesPageComponent extends NamedFragmentsDirective implements CanDeactivateComponent {
  public readonly fleetId$: Observable<string> = this.store.select(selectedFleetId);
  public readonly hasActiveTickets$: Observable<boolean> = this.fleetId$.pipe(
    filter(Boolean),
    switchMap((id) => this.ticketsService.getFleetActivePhotoControlExist(id)),
    map(({ has_active_tickets }) => has_active_tickets),
  );

  public readonly showVehicleBrandingPeriod$ = this.store.select(getVehicleBrandingPeriodAvailable);
  public readonly appConfig = inject<EnvironmentModel>(APP_CONFIG);
  public readonly uploadCount = signal<number>(0);

  constructor(
    private readonly store: Store<AccountState>,
    private readonly paginationStore: Store<PaginationState>,
    private readonly analytics: AnalyticsService,
    private readonly storage: StorageService,
    private readonly ticketsService: TicketsService,
    private readonly destroyRef: DestroyRef,
    @Inject(ICONS) public icons: IconsConfig,
  ) {
    super();
    this.handleTabNavigation();
  }

  public override handleFragmentChange(index: number): void {
    super.handleFragmentChange(index);

    this.paginationStore.dispatch(paginationActions.clearState());
  }

  public canDeactivate(): boolean {
    return this.uploadCount() === 0;
  }

  private reportTabChange(index: number): void {
    if (!TAB_ANALYTICS_TYPE[index]) return;

    this.analytics.reportEvent<AnalyticsUserRole>(TAB_ANALYTICS_TYPE[index], {
      user_access: this.storage.get(userRoleKey),
    });
  }

  private handleTabNavigation(): void {
    this.navigatedToFragment$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((index) => this.reportTabChange(index));
  }
}
