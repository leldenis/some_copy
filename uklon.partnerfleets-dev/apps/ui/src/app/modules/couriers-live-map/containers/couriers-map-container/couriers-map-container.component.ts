import { AsyncPipe, NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, Inject, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { AnalyticsService } from '@ui/core/services/analytics.service';
import { AccountState } from '@ui/core/store/account/account.reducer';
import { CouriersMapComponent } from '@ui/modules/couriers-live-map/components/couriers-map/couriers-map.component';
import { CouriersMapFiltersComponent } from '@ui/modules/couriers-live-map/components/couriers-map-filters/couriers-map-filters.component';
import { MapContainerComponent } from '@ui/modules/live-map/containers';
import { UIService } from '@ui/shared';
import { LetDirective } from '@ui/shared/directives/let.directive';
import { GeolocationService, LiveMapType, LIVE_MAP_TYPE } from '@ui/shared/modules/live-map-shared';

@Component({
  selector: 'upf-couriers-map-container',
  standalone: true,
  imports: [CouriersMapFiltersComponent, NgClass, LetDirective, AsyncPipe, TranslateModule, CouriersMapComponent],
  providers: [{ provide: LIVE_MAP_TYPE, useValue: LiveMapType.COURIER }],
  templateUrl: './couriers-map-container.component.html',
  styleUrls: ['./couriers-map-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CouriersMapContainerComponent extends MapContainerComponent implements OnDestroy {
  @ViewChild(CouriersMapFiltersComponent)
  public couriersMapFilters: CouriersMapFiltersComponent;

  constructor(
    protected override readonly geoService: GeolocationService,
    protected override readonly store: Store<AccountState>,
    protected override readonly analytics: AnalyticsService,
    protected override readonly uiService: UIService,
    protected override readonly router: Router,
    protected override readonly route: ActivatedRoute,
    protected override readonly destroyRef: DestroyRef,
    @Inject(LIVE_MAP_TYPE) protected override readonly mapType: LiveMapType,
  ) {
    super(geoService, store, analytics, uiService, router, route, destroyRef, mapType);
  }
}
