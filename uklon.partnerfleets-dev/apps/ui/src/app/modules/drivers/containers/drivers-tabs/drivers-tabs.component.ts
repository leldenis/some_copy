import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, Inject, OnInit, ViewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatTab, MatTabContent, MatTabGroup, MatTabLabel } from '@angular/material/tabs';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { AccountState } from '@ui/core/store/account/account.reducer';
import { selectedFleetId, selectedFleetRegionId } from '@ui/core/store/account/account.selectors';
import { DriversContainerComponent } from '@ui/modules/drivers/components/drivers-container/drivers-container.component';
import { DriversTicketsComponent } from '@ui/modules/drivers/components/drivers-tickets/drivers-tickets.component';
import { DriversPhotoControlContainerComponent } from '@ui/modules/drivers/containers/drivers-photo-control-container/drivers-photo-control-container.component';
import { UklonGarageApplicationsComponent } from '@ui/modules/drivers/features/uklon-garage/containers';
import { DriverPhotoControlService } from '@ui/modules/drivers/services/driver-photo-control.service';
import { UklonGarageService } from '@ui/modules/drivers/services/uklon-garage.service';
import { IndicatorComponent, NAMED_FRAGMENTS, NamedFragmentsDirective } from '@ui/shared';
import { IconsConfig } from '@ui/shared/tokens/icons.config';
import { ICONS } from '@ui/shared/tokens/icons.token';
import { EnvironmentModel } from '@ui-env/environment.model';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { map, Observable, shareReplay, switchMap } from 'rxjs';
import { filter } from 'rxjs/operators';

import { APP_CONFIG } from '@uklon/angular-core';

const UKLON_GARAGE_TAB_INDEX = 2;

@Component({
  selector: 'upf-drivers-tabs',
  standalone: true,
  imports: [
    InfiniteScrollDirective,
    AsyncPipe,
    MatTabGroup,
    MatTab,
    TranslateModule,
    DriversContainerComponent,
    MatTabContent,
    MatTabLabel,
    DriversTicketsComponent,
    UklonGarageApplicationsComponent,
    IndicatorComponent,
    DriversPhotoControlContainerComponent,
  ],
  templateUrl: './drivers-tabs.component.html',
  styleUrls: ['./drivers-tabs.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NAMED_FRAGMENTS,
      useValue: ['list', 'tickets', 'garage-applications', 'photo-control'],
    },
  ],
})
export class DriversTabsComponent extends NamedFragmentsDirective implements OnInit {
  @ViewChild(MatTabGroup)
  private readonly tabs: MatTabGroup;

  public readonly fleetId$: Observable<string> = this.accountStore.select(selectedFleetId);
  public readonly regionId$: Observable<number> = this.accountStore.select(selectedFleetRegionId);
  public readonly fleetHasApplications$ = this.fleetId$.pipe(
    filter(Boolean),
    switchMap((id) => this.garageService.fleetHasApplications(id)),
    map(({ has_applications }) => has_applications),
    shareReplay(1),
  );
  public readonly hasActiveTickets$: Observable<boolean> = this.fleetId$.pipe(
    filter(Boolean),
    switchMap((id) => this.driverPhotoControlService.getDriversActivePhotoControlExist(id)),
  );

  constructor(
    private readonly destroyRef: DestroyRef,
    private readonly accountStore: Store<AccountState>,
    private readonly garageService: UklonGarageService,
    private readonly driverPhotoControlService: DriverPhotoControlService,
    @Inject(ICONS) public icons: IconsConfig,
    @Inject(APP_CONFIG) public readonly appConfig: EnvironmentModel,
  ) {
    super();
  }

  public ngOnInit(): void {
    this.setupGarageTabSelection();
  }

  private setupGarageTabSelection(): void {
    this.fleetHasApplications$
      .pipe(
        filter(Boolean),
        switchMap(() => this.selectedTabIndex$),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((index) => {
        if (index === UKLON_GARAGE_TAB_INDEX) {
          this.tabs.selectedIndex = UKLON_GARAGE_TAB_INDEX;
        }
      });
  }
}
