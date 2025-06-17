import { AsyncPipe, NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, Inject, OnDestroy, ViewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AnalyticsBase,
  CustomAnalyticsPropertiesDto,
  FleetAnalyticsEventType,
  FleetDto,
  LiveMapDataDto,
  LiveMapFiltersDto,
  LiveMapLocationDto,
} from '@data-access';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { CorePaths } from '@ui/core/models/core-paths';
import { AnalyticsService } from '@ui/core/services/analytics.service';
import { AccountState } from '@ui/core/store/account/account.reducer';
import { getSelectedFleet } from '@ui/core/store/account/account.selectors';
import { MapComponent } from '@ui/modules/live-map/components/map/map.component';
import { UIService } from '@ui/shared';
import { LetDirective } from '@ui/shared/directives/let.directive';
import { GeolocationService, LIVE_MAP_TYPE, LiveMapType } from '@ui/shared/modules/live-map-shared';
import moment from 'moment';
import { BehaviorSubject, combineLatest, interval, Observable } from 'rxjs';
import { filter, map, startWith, switchMap, tap } from 'rxjs/operators';

import { toClientDate } from '@uklon/angular-core';

import { MapFiltersComponent } from '../../components/map-filters/map-filters.component';

const INTERVAL = 1000; // 1 second

@Component({
  selector: 'upf-map-container',
  standalone: true,
  imports: [MapFiltersComponent, TranslateModule, NgClass, LetDirective, AsyncPipe, MapComponent],
  providers: [{ provide: LIVE_MAP_TYPE, useValue: LiveMapType.DRIVER }],
  templateUrl: './map-container.component.html',
  styleUrls: ['./map-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapContainerComponent implements OnDestroy {
  @ViewChild(MapFiltersComponent)
  public mapFilters: MapFiltersComponent;

  public refreshedOn: number;
  public isFullScreen = false;

  public readonly infinity = Number.POSITIVE_INFINITY;
  public readonly refresh$ = new BehaviorSubject<void>(null);
  public readonly filtersChange$ = new BehaviorSubject<LiveMapFiltersDto>(null);
  public readonly interval$: Observable<number> = interval(INTERVAL)
    .pipe(startWith(0))
    .pipe(tap(() => this.getDataOnInterval()));
  public readonly fleet$: Observable<FleetDto> = this.store.select(getSelectedFleet).pipe(filter(Boolean));
  public readonly cityCenter$: Observable<LiveMapLocationDto> = this.fleet$.pipe(
    switchMap(({ region_id }) => this.geoService.getLocationByRegionId(region_id)),
  );
  public readonly isMobileView$: Observable<boolean> = this.uiService.breakpointMatch();
  public readonly mapData$: Observable<
    LiveMapDataDto & {
      fleetId: string;
    }
  > = combineLatest([this.fleet$, this.refresh$]).pipe(switchMap(([{ id }]) => this.getMapData(id)));

  protected mapRoute: CorePaths[];
  protected cacheTTLMs = this.infinity;

  constructor(
    protected readonly geoService: GeolocationService,
    protected readonly store: Store<AccountState>,
    protected readonly analytics: AnalyticsService,
    protected readonly uiService: UIService,
    protected readonly router: Router,
    protected readonly route: ActivatedRoute,
    protected readonly destroyRef: DestroyRef,
    @Inject(LIVE_MAP_TYPE) protected readonly mapType: LiveMapType,
  ) {
    this.setShellConfig();
    this.reportEvent(FleetAnalyticsEventType.LIVE_MAP_SCREEN);
    this.handleFiltersChanges();

    this.mapRoute =
      this.mapType === LiveMapType.DRIVER
        ? [CorePaths.WORKSPACE, CorePaths.LIVE_MAP]
        : [CorePaths.WORKSPACE, CorePaths.COURIERS, CorePaths.LIVE_MAP];
  }

  public ngOnDestroy(): void {
    this.uiService.resetConfig();
    this.uiService.toggleFullScreenMode(false);
  }

  public onToggleFullScreen(enable: boolean): void {
    this.isFullScreen = enable;
    this.uiService.toggleFullScreenMode(this.isFullScreen);
  }

  public onReportAnalytics(eventType: FleetAnalyticsEventType, inputName: string): void {
    this.reportEvent(eventType, { search_input_name: inputName });
  }

  protected setShellConfig(): void {
    this.uiService.setConfig({
      header: {
        title: true,
        backNavigationButton: false,
      },
    });
  }

  protected getDataOnInterval(): void {
    const diff = moment(this.refreshedOn + this.cacheTTLMs).diff(moment(), 'millisecond');

    if (diff >= 0 || document.hidden) return;
    this.refresh$.next();
  }

  protected getMapData(fleetId: string): Observable<LiveMapDataDto & { fleetId: string }> {
    const request$ =
      this.mapType === LiveMapType.DRIVER
        ? this.geoService.getDriversLocations(fleetId)
        : this.geoService.getCouriersLocations(fleetId);

    return request$.pipe(
      map((data) => ({ ...data, fleetId })),
      tap(({ actual_on, cache_time_to_live }) => {
        this.refreshedOn = toClientDate(actual_on).getTime();
        this.cacheTTLMs = cache_time_to_live * 1000;
      }),
    );
  }

  protected reportEvent(eventType: FleetAnalyticsEventType, props: CustomAnalyticsPropertiesDto = {}): void {
    this.analytics.reportEvent<AnalyticsBase>(eventType, props);
  }

  protected handleFiltersChanges(): void {
    this.filtersChange$
      .pipe(filter(Boolean), takeUntilDestroyed(this.destroyRef))
      .subscribe(({ name, licensePlate }) => {
        this.router.navigate(this.mapRoute, {
          fragment: this.route.snapshot.fragment,
          queryParams:
            !name && !licensePlate
              ? { name: null, licensePlate: null }
              : {
                  name,
                  licensePlate,
                },
          queryParamsHandling: 'merge',
        });
      });
  }
}
