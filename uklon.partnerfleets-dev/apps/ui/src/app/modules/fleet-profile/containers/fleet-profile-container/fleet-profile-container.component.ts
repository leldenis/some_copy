import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnDestroy, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AnalyticsUserRole, FleetAnalyticsEventType, FleetDetailsDto, RegionDto } from '@data-access';
import { Store } from '@ngrx/store';
import { FleetService } from '@ui/core';
import { AnalyticsService } from '@ui/core/services/analytics.service';
import { StorageService, userRoleKey } from '@ui/core/services/storage.service';
import { account, getRROAvailable, getRegion, selectedFleetId } from '@ui/core/store/account/account.selectors';
import { FleetProfileInfoComponent } from '@ui/modules/fleet-profile/components/fleet-profile-info/fleet-profile-info.component';
import { FleetProfileTabsComponent } from '@ui/modules/fleet-profile/containers/fleet-profile-tabs/fleet-profile-tabs.component';
import { ProfileIndicatorService } from '@ui/modules/fleet-profile/features/fleet-rro/services';
import { fiscalizationSettings, fleetRROActions } from '@ui/modules/fleet-profile/features/fleet-rro/store';
import { fleetProfileActions, getB2BAvailable } from '@ui/modules/fleet-profile/store';
import { UIService } from '@ui/shared';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { Observable, filter, share, switchMap, pipe } from 'rxjs';

@Component({
  selector: 'upf-fleet-profile-container',
  standalone: true,
  imports: [AsyncPipe, InfiniteScrollDirective, FleetProfileInfoComponent, FleetProfileTabsComponent],
  templateUrl: './fleet-profile-container.component.html',
  styleUrls: ['./fleet-profile-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FleetProfileContainerComponent implements OnDestroy, OnInit {
  private readonly uiService = inject(UIService);
  private readonly fleetService = inject(FleetService);
  private readonly profileIndicatorService = inject(ProfileIndicatorService);
  private readonly store = inject(Store);
  private readonly analytics = inject(AnalyticsService);
  private readonly storage = inject(StorageService);
  private readonly destroyRef = inject(DestroyRef);

  public readonly fleet$: Observable<FleetDetailsDto> = this.store.select(selectedFleetId).pipe(
    filter(Boolean),
    switchMap((id) => this.fleetService.getFleetById(id)),
    share(),
    takeUntilDestroyed(this.destroyRef),
  );
  public readonly account$ = this.store.select(account);
  public readonly region$ = this.store.select(getRegion).pipe(filter(Boolean)) as Observable<RegionDto>;
  public readonly rroAvailable$ = this.store.select(getRROAvailable);
  public readonly fiscalizationSettings$ = this.store.select(pipe(fiscalizationSettings));
  public readonly b2bActivated$ = this.store.select(pipe(getB2BAvailable));
  public readonly showIndicator$ = this.profileIndicatorService.showIndicator$;

  public ngOnInit(): void {
    this.setHeaderConfig();
    this.analytics.reportEvent<AnalyticsUserRole>(FleetAnalyticsEventType.FLEET_PROFILE_PAGE, {
      user_access: this.storage.get(userRoleKey),
    });
    this.store.dispatch(fleetProfileActions.getFleetEntrepreneurs());
  }

  public ngOnDestroy(): void {
    this.store.dispatch(fleetRROActions.clearState());
    this.uiService.resetConfig();
  }

  private setHeaderConfig(): void {
    this.uiService.setConfig({
      header: {
        title: true,
        backNavigationButton: false,
      },
    });
  }
}
