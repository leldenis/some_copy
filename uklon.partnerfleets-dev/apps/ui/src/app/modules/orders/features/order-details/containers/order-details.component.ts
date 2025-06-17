import { AsyncPipe, Location } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { OrderStatus } from '@constant';
import {
  OrderRecordDto,
  AnalyticsUserRole,
  FleetAnalyticsEventType,
  ActiveOrderItemDto,
  OrderRecordRoutePointDto,
  EmployeeLocationStatus,
} from '@data-access';
import { decode } from '@googlemaps/polyline-codec';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { CorePaths } from '@ui/core/models/core-paths';
import { AnalyticsService } from '@ui/core/services/analytics.service';
import { LoadingIndicatorService } from '@ui/core/services/loading-indicator.service';
import { StorageService, userRoleKey } from '@ui/core/services/storage.service';
import { DriverPaths } from '@ui/modules/drivers/models/driver-paths';
import { OrderDetailsPanelComponent } from '@ui/modules/orders/features/order-details/components/order-details-panel/order-details-panel.component';
import { OrdersFeatureActionGroup } from '@ui/modules/orders/store/actions/orders.actions';
import { OrdersFeatureState } from '@ui/modules/orders/store/reducers/orders.reducer';
import { selectOrder } from '@ui/modules/orders/store/selectors/orders.selectors';
import { UIService } from '@ui/shared';
import { EmptyStateComponent } from '@ui/shared/components/empty-state/empty-state.component';
import { EmptyStates } from '@ui/shared/components/empty-state/empty-states';
import { ToggleMapInteractionsDirective } from '@ui/shared/modules/live-map-shared';
import { GET_ROUTE_ICON, ROUTE_COLOR, STATUS_ICONS } from '@ui/shared/modules/live-map-shared/consts';
import { GeolocationService, LiveMapService } from '@ui/shared/modules/live-map-shared/services';
import { IconsConfig } from '@ui/shared/tokens/icons.config';
import { ICONS } from '@ui/shared/tokens/icons.token';
import { LatLngTuple, Map, MapOptions } from 'leaflet';
import { Observable, of } from 'rxjs';
import { filter, finalize, map, switchMap, tap } from 'rxjs/operators';

import { toServerDate } from '@uklon/angular-core';

import { OrdersService } from '../../../services';

import { activeOrderToOrder } from '../utils/order-mapper';

const ICON_RADIUS_PX = 12;
const DRIVER_ICON_RADIUS_PX = 14;

@Component({
  selector: 'upf-order-details',
  standalone: true,
  imports: [
    AsyncPipe,
    LeafletModule,
    OrderDetailsPanelComponent,
    ToggleMapInteractionsDirective,
    TranslateModule,
    EmptyStateComponent,
  ],
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderDetailsComponent implements OnInit, OnDestroy {
  public order$: Observable<OrderRecordDto> = this.ordersStore.select(selectOrder).pipe(
    filter(Boolean),
    tap(({ status }) => {
      if (status === OrderStatus.CANCELED) this.navigateBack();
    }),
    switchMap((order) => this.getCurrentOrder(order)),
    finalize(() => this.loaderService.hide()),
  );

  public readonly mapLayer = this.mapService.mapLayer;
  public readonly emptyState = EmptyStates;
  public readonly orderStatus = OrderStatus;
  public mapOptions: MapOptions = {
    layers: [this.mapLayer],
    zoom: 12,
    minZoom: 10,
    maxZoom: 20,
    center: [0, 0],
  };
  public corePaths = CorePaths;
  public driverPaths = DriverPaths;
  public isLoading$ = this.loaderService.isLoading$.pipe(map(({ show }) => show));
  public isMobileView$: Observable<boolean> = this.uiService.breakpointMatch();

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly ordersStore: Store<OrdersFeatureState>,
    private readonly location: Location,
    private readonly analytics: AnalyticsService,
    private readonly storage: StorageService,
    private readonly mapService: LiveMapService,
    private readonly uiService: UIService,
    private readonly geoService: GeolocationService,
    private readonly ordersService: OrdersService,
    private readonly loaderService: LoadingIndicatorService,
    @Inject(ICONS) public icons: IconsConfig,
  ) {
    this.analytics.reportEvent<AnalyticsUserRole>(FleetAnalyticsEventType.ORDER_DETAILS_SCREEN, {
      user_access: this.storage.get(userRoleKey || ''),
    });

    this.uiService.setConfig({
      header: {
        title: false,
        branding: false,
        backNavigationButton: true,
        hideTitleOnMobile: true,
        customTitle: 'Header.Title.OrderTripsDetails',
      },
    });
  }

  private get map(): Map {
    return this.mapService.map;
  }

  public ngOnInit(): void {
    const driverId = this.route.snapshot.queryParamMap.get('driverId');
    const orderId = this.route.snapshot.paramMap.get('orderId');

    this.loaderService.show();
    this.ordersStore.dispatch(OrdersFeatureActionGroup.requestOrder({ orderId, driverId }));
  }

  public ngOnDestroy(): void {
    this.ordersStore.dispatch(OrdersFeatureActionGroup.setOrder(null));
    this.mapService.disposeMap();
    this.uiService.resetConfig();
  }

  public onMapReady(leafletMap: Map, order: OrderRecordDto, isMobileView: boolean): void {
    this.mapService.initMap(leafletMap);

    this.setMapCenter(order.route.points, isMobileView);
    this.drawRouteMarkers(order);
    this.drawSystemRoute(order);
    this.drawActualRoute(order);
  }

  public navigateBack(): void {
    this.router.navigated ? this.location.back() : this.router.navigate(['../'], { relativeTo: this.route });
  }

  public enableMapInteractions(): void {
    this.mapService.toggleMapInteractions(true);
  }

  private getCurrentOrder(order: OrderRecordDto): Observable<OrderRecordDto> {
    return (
      order.status === OrderStatus.RUNNING
        ? this.ordersService
            .getDriverActiveOrders(order.driver.id, order.id)
            .pipe(
              map(([activeOrder]) =>
                activeOrderToOrder({ ...order, ...activeOrder } as ActiveOrderItemDto & OrderRecordDto),
              ),
            )
        : of(order)
    ).pipe(finalize(() => this.loaderService.hide()));
  }

  private drawSystemRoute(order: OrderRecordDto): void {
    const points = decode(order.route?.overviewPolyline || '');

    if (!points?.length) return;

    const systemRoute = this.mapService.generateRoute(points, ROUTE_COLOR.SYSTEM, false, 8);
    const border = this.mapService.generateRoute(points, ROUTE_COLOR.BORDER, false, 12);

    this.map.addLayer(border).addLayer(systemRoute);
    this.mapService.setMapCenter(points, false);
  }

  private drawActualRoute(order: OrderRecordDto): void {
    const {
      driver: { id },
      createdAt,
      completedAt,
      status,
    } = order;
    const to = completedAt || toServerDate(new Date());

    if (createdAt > to) return;

    this.geoService
      .getEmployeeLocationInTimeframe(id, createdAt, to)
      .pipe(filter((locations) => locations.length > 0))
      .subscribe((locations) => {
        const points = locations.map(({ location: { coordinates } }) => coordinates.reverse() as LatLngTuple);
        const actualRoute = this.mapService.generateRoute(points, ROUTE_COLOR.ACTUAL);
        this.map?.addLayer(actualRoute);

        if (status === this.orderStatus.RUNNING && locations.length > 0) {
          this.drawDriverMarker(points[0]);
        }
      });
  }

  private drawDriverMarker(driverCoords: LatLngTuple): void {
    const marker = this.mapService.generateMarker(
      driverCoords,
      `assets/icons/map/${STATUS_ICONS[EmployeeLocationStatus.OrderExecution]}`,
      DRIVER_ICON_RADIUS_PX,
    );

    this.map.addLayer(marker);
  }

  private drawRouteMarkers(order: OrderRecordDto): void {
    const markerCoords: LatLngTuple[] = order.route?.points?.map((route) => [route.latitude, route.longitude]);
    markerCoords?.forEach((coordinates, index) => {
      const marker = this.mapService.generateMarker(
        coordinates,
        `assets/icons/map/${GET_ROUTE_ICON(markerCoords, index)}`,
        ICON_RADIUS_PX,
      );

      marker.bindTooltip(order.route?.points[index]?.address, { direction: 'top' });
      this.map.addLayer(marker);
    });
  }

  private setMapCenter(points: OrderRecordRoutePointDto[], isMobileView: boolean): void {
    const bounds = points?.map(({ latitude, longitude }) => [latitude, longitude]) as LatLngTuple[];
    this.mapService.setMapCenter(bounds, isMobileView);
  }
}
