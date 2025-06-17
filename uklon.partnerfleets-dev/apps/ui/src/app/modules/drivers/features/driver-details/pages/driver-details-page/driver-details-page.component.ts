import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { AsyncPipe, Location } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, Inject, OnDestroy, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { BlockedListStatusValue } from '@constant';
import {
  AnalyticsDriverBase,
  AnalyticsDriverDeleted,
  FleetAnalyticsEventType,
  FleetDriverDto,
  FleetDto,
  KarmaGroupDto,
  DateRangeDto,
  RemoveReasonDto,
} from '@data-access';
import { Store } from '@ngrx/store';
import { FleetService } from '@ui/core';
import { AnalyticsService } from '@ui/core/services/analytics.service';
import { StorageService, userRoleKey } from '@ui/core/services/storage.service';
import { AccountState } from '@ui/core/store/account/account.reducer';
import { getSelectedFleet } from '@ui/core/store/account/account.selectors';
import { DriverDetailsInfoComponent } from '@ui/modules/drivers/features/driver-details/components/driver-details-info/driver-details-info.component';
import { DriverDetailsTabsComponent } from '@ui/modules/drivers/features/driver-details/components/driver-details-tabs/driver-details-tabs.component';
import { DriverPhotoControlService } from '@ui/modules/drivers/services/driver-photo-control.service';
import { driversActions } from '@ui/modules/drivers/store/drivers/drivers.actions';
import { DriversEffects } from '@ui/modules/drivers/store/drivers/drivers.effects';
import { DriversState } from '@ui/modules/drivers/store/drivers/drivers.reducer';
import * as driversSelectors from '@ui/modules/drivers/store/drivers/drivers.selectors';
import { vehiclesActions } from '@ui/modules/vehicles/store/vehicles/vehicles.actions';
import { VehiclesState } from '@ui/modules/vehicles/store/vehicles/vehicles.reducer';
import { UIService } from '@ui/shared';
import { IconsConfig } from '@ui/shared/tokens/icons.config';
import { ICONS } from '@ui/shared/tokens/icons.token';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { Observable, share, shareReplay } from 'rxjs';
import { filter, first, map, switchMap } from 'rxjs/operators';

import { RemoveDriverService } from '../../services/remove-driver.service';

@Component({
  selector: 'upf-driver-details-page',
  standalone: true,
  imports: [AsyncPipe, InfiniteScrollDirective, DriverDetailsInfoComponent, DriverDetailsTabsComponent],
  templateUrl: './driver-details-page.component.html',
  styleUrls: ['./driver-details-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DriverDetailsPageComponent implements OnInit, OnDestroy {
  public driver$: Observable<FleetDriverDto> = this.driversStore
    .select(driversSelectors.getFleetDriverDetails)
    .pipe(shareReplay(1));
  public photoControl$ = this.driver$.pipe(
    filter((driver) => !!driver?.photo_control),
    first(),
    switchMap(({ photo_control }) =>
      this.driverPhotoControlService.getDriverPhotoControlTicket(photo_control.ticket_id),
    ),
  );
  public fleet$: Observable<FleetDto> = this.accountStore.select(getSelectedFleet);
  public isMobileView$: Observable<boolean> = this.breakpointObserver
    .observe(['(max-width: 767px)'])
    .pipe(map((breakpointState: BreakpointState) => breakpointState.matches));
  public karmaGroupRanges$: Observable<KarmaGroupDto<DateRangeDto>>;
  public driverBlockedListStatus = BlockedListStatusValue;

  private readonly hasHistory: boolean;

  constructor(
    @Inject(ICONS)
    public readonly icons: IconsConfig,
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
    private readonly driversStore: Store<DriversState>,
    private readonly accountStore: Store<AccountState>,
    private readonly location: Location,
    private readonly driversEffects: DriversEffects,
    private readonly vehiclesStore: Store<VehiclesState>,
    private readonly removeDriverService: RemoveDriverService,
    private readonly fleetService: FleetService,
    private readonly uiService: UIService,
    private readonly driverPhotoControlService: DriverPhotoControlService,
    private readonly analytics: AnalyticsService,
    private readonly storage: StorageService,
    private readonly breakpointObserver: BreakpointObserver,
    private readonly destroyRef: DestroyRef,
  ) {
    this.hasHistory = this.router.navigated;
    this.setShellConfig();

    this.analytics.reportEvent<AnalyticsDriverBase>(
      FleetAnalyticsEventType.DRIVERS_DRIVER_DETAIL_SCREEN,
      this.driverEventBaseConfig,
    );
  }

  private get driverEventBaseConfig(): AnalyticsDriverBase {
    return {
      driver_id: this.activatedRoute.snapshot.paramMap.get('driverId'),
      user_access: this.storage.get(userRoleKey),
    };
  }

  public ngOnInit(): void {
    this.driversEffects.removeFleetDriverByIdSuccess$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.navigateBack());

    this.setKarmaGroupRanges();
  }

  public ngOnDestroy(): void {
    this.driversStore.dispatch(driversActions.getFleetDriverByIdFailed());
    this.driversStore.dispatch(driversActions.clearFleetDriverPhotos());
    this.driversStore.dispatch(driversActions.clearDriverRideConditions());
    this.vehiclesStore.dispatch(vehiclesActions.clearFleetVehiclePhotos());
    this.uiService.resetConfig();
  }

  public navigateBack(): void {
    this.hasHistory ? this.location.back() : this.router.navigate(['../'], { relativeTo: this.activatedRoute });
  }

  public handleDriverDelete(driver: FleetDriverDto, fleetId: string): void {
    this.removeDriverService
      .remove(driver, fleetId)
      .pipe(filter((response) => !!response))
      .subscribe((response) => {
        this.analytics.reportEvent<AnalyticsDriverDeleted>(FleetAnalyticsEventType.DRIVERS_DELETE_DRIVER_CONFIRMED, {
          reason: (response as RemoveReasonDto).reason,
          comment: (response as RemoveReasonDto).comment,
          ...this.driverEventBaseConfig,
        });
      });

    this.analytics.reportEvent<AnalyticsDriverBase>(
      FleetAnalyticsEventType.DRIVERS_DELETE_DRIVER,
      this.driverEventBaseConfig,
    );
  }

  public handleUnlinkVehicle(): void {
    this.driversStore.dispatch(driversActions.openUnlinkVehicleDialog());
  }

  private setKarmaGroupRanges(): void {
    this.karmaGroupRanges$ = this.fleet$.pipe(
      map((currentFleet) => currentFleet?.region_id),
      filter((regionId) => coerceBooleanProperty(regionId)),
      switchMap((regionId) => this.fleetService.getRegion(`${regionId}`)),
      map((region) => region?.karma_settings?.group_ranges),
      share(),
    );
  }

  private setShellConfig(): void {
    this.uiService.setConfig({
      header: {
        customTitle: 'Header.Title.DriverDetails',
        title: false,
        branding: false,
        backNavigationButton: true,
        hideTitleOnMobile: true,
      },
    });
  }
}
