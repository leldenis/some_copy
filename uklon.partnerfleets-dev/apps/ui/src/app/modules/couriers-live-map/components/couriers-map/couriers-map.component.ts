import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, Inject, OnDestroy } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { LiveMapEmployeeDto } from '@data-access';
import { TranslateModule } from '@ngx-translate/core';
import { AnalyticsService } from '@ui/core/services/analytics.service';
import { AppTranslateService } from '@ui/core/services/app-translate.service';
import { CouriersMapPanelComponent } from '@ui/modules/couriers-live-map/components/couriers-map-panel/couriers-map-panel.component';
import { CouriersMapSearchComponent } from '@ui/modules/couriers-live-map/components/couriers-map-search/couriers-map-search.component';
import { MapCourierPanelComponent } from '@ui/modules/couriers-live-map/components/map-courier-panel/map-courier-panel.component';
import { MapCouriersPanelComponent } from '@ui/modules/couriers-live-map/components/map-couriers-panel/map-couriers-panel.component';
import { MapComponent } from '@ui/modules/live-map/components/map/map.component';
import { OrdersService } from '@ui/modules/orders/services';
import { TO_FILTER_FORMAT } from '@ui/shared';
import { LetDirective } from '@ui/shared/directives/let.directive';
import {
  GeolocationService,
  LiveMapService,
  LiveMapType,
  LIVE_MAP_TYPE,
  ToggleMapInteractionsDirective,
} from '@ui/shared/modules/live-map-shared';
import { MapTripComponent } from '@ui/shared/modules/live-map-shared/components/map-trip/map-trip.component';

@Component({
  selector: 'upf-couriers-map',
  standalone: true,
  imports: [
    AsyncPipe,
    LetDirective,
    LeafletModule,
    CouriersMapPanelComponent,
    ToggleMapInteractionsDirective,
    MapCouriersPanelComponent,
    MapCourierPanelComponent,
    MapTripComponent,
    CouriersMapSearchComponent,
    MatIcon,
    TranslateModule,
  ],
  templateUrl: './couriers-map.component.html',
  styleUrls: ['./couriers-map.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CouriersMapComponent extends MapComponent implements OnDestroy {
  constructor(
    protected override readonly mapService: LiveMapService,
    protected override readonly geoService: GeolocationService,
    protected override readonly ordersService: OrdersService,
    protected override readonly appTranslateService: AppTranslateService,
    protected override readonly analytics: AnalyticsService,
    protected override readonly router: Router,
    protected override readonly route: ActivatedRoute,
    protected override readonly destroyRef: DestroyRef,
    @Inject(LIVE_MAP_TYPE) protected override mapType: LiveMapType,
  ) {
    super(mapService, geoService, ordersService, appTranslateService, analytics, router, route, destroyRef, mapType);
  }

  protected override filterFn({ first_name, last_name }: LiveMapEmployeeDto, _: string, name: string): boolean {
    return TO_FILTER_FORMAT(`${first_name}${last_name}`).includes(TO_FILTER_FORMAT(name));
  }
}
