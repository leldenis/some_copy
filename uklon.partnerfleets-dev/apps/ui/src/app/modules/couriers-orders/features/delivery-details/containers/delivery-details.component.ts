import { AsyncPipe, Location } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { OrderStatus } from '@constant';
import { DeliveryRecordDto, EmployeeLocationStatus, Employee, OrderRecordRoutePointDto } from '@data-access';
import { decode } from '@googlemaps/polyline-codec';
import { TranslateModule } from '@ngx-translate/core';
import { CorePaths } from '@ui/core/models/core-paths';
import { LoadingIndicatorService } from '@ui/core/services/loading-indicator.service';
import { DeliveryDetailsPanelComponent } from '@ui/modules/couriers-orders/features/delivery-details/components/delivery-details-panel/delivery-details-panel.component';
import { DriverPaths } from '@ui/modules/drivers/models/driver-paths';
import { OrdersService } from '@ui/modules/orders/services';
import { UIService } from '@ui/shared';
import { EmptyStateComponent } from '@ui/shared/components/empty-state/empty-state.component';
import { EmptyStates } from '@ui/shared/components/empty-state/empty-states';
import {
  LiveMapService,
  GeolocationService,
  GET_ROUTE_ICON,
  ROUTE_COLOR,
  STATUS_ICONS,
  ToggleMapInteractionsDirective,
} from '@ui/shared/modules/live-map-shared';
import { IconsConfig } from '@ui/shared/tokens/icons.config';
import { ICONS } from '@ui/shared/tokens/icons.token';
import { LatLngTuple, Map, MapOptions } from 'leaflet';
import { Observable, combineLatest, filter, finalize, map, switchMap } from 'rxjs';

import { toServerDate } from '@uklon/angular-core';

const ICON_RADIUS_PX = 12;
const COURIER_ICON_RADIUS_PX = 14;

@Component({
  selector: 'upf-delivery-details',
  standalone: true,
  imports: [
    AsyncPipe,
    LeafletModule,
    DeliveryDetailsPanelComponent,
    TranslateModule,
    EmptyStateComponent,
    ToggleMapInteractionsDirective,
  ],
  templateUrl: './delivery-details.component.html',
  styleUrls: ['./delivery-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeliveryDetailsComponent implements OnDestroy {
  public readonly delivery$ = combineLatest([this.route.paramMap, this.route.queryParamMap]).pipe(
    switchMap(([params, query]) =>
      this.ordersService
        .getCourierDeliveryById(params.get('orderId'), query.get('courierId'))
        .pipe(finalize(() => this.loaderService.hide())),
    ),
  );

  public readonly mapLayer = this.mapService.mapLayer;
  public readonly emptyState = EmptyStates;
  public readonly orderStatus = OrderStatus;
  public mapOptions: MapOptions = {
    layers: [this.mapLayer],
    zoom: 12,
    minZoom: 0,
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
    private readonly location: Location,
    private readonly mapService: LiveMapService,
    private readonly uiService: UIService,
    private readonly geoService: GeolocationService,
    private readonly ordersService: OrdersService,
    private readonly loaderService: LoadingIndicatorService,
    @Inject(ICONS) public icons: IconsConfig,
  ) {
    this.loaderService.show();
    this.uiService.setConfig({
      header: {
        title: false,
        branding: false,
        backNavigationButton: true,
        hideTitleOnMobile: true,
        customTitle: 'Header.Title.CourierDeliveryDetails',
      },
    });
  }

  private get map(): Map {
    return this.mapService.map;
  }

  public ngOnDestroy(): void {
    this.mapService.disposeMap();
    this.uiService.resetConfig();
    this.loaderService.hide();
  }

  public onMapReady(leafletMap: Map, delivery: DeliveryRecordDto, isMobileView: boolean): void {
    this.mapService.initMap(leafletMap);

    this.setMapCenter(delivery.route.points, isMobileView);
    this.drawRouteMarkers(delivery);
    this.drawSystemRoute(delivery);
    this.drawActualRoute(delivery);
  }

  public navigateBack(): void {
    this.router.navigated ? this.location.back() : this.router.navigate(['../'], { relativeTo: this.route });
  }

  public enableMapInteractions(): void {
    this.mapService.toggleMapInteractions(true);
  }

  private drawSystemRoute(delivery: DeliveryRecordDto): void {
    const points = decode(delivery.route?.overviewPolyline || '');

    if (!points?.length) return;

    const systemRoute = this.mapService.generateRoute(points, ROUTE_COLOR.SYSTEM, false, 8);
    const border = this.mapService.generateRoute(points, ROUTE_COLOR.BORDER, false, 12);

    this.map.addLayer(border).addLayer(systemRoute);
    this.mapService.setMapCenter(points, false);
  }

  private drawActualRoute(delivery: DeliveryRecordDto): void {
    const {
      courier: { id },
      createdAt,
      completedAt,
      status,
    } = delivery;
    const to = completedAt || toServerDate(new Date());

    if (createdAt > to) return;

    this.geoService
      .getEmployeeLocationInTimeframe(id, createdAt, to, Employee.COURIER)
      .pipe(filter((locations) => locations.length > 0))
      .subscribe((locations) => {
        const actual = locations.map(({ location: { coordinates } }) => coordinates.reverse() as LatLngTuple);
        const actualRoute = this.mapService.generateRoute(actual, ROUTE_COLOR.ACTUAL);
        this.map?.addLayer(actualRoute);

        if (status === this.orderStatus.RUNNING && locations.length > 0) {
          this.drawDriverMarker(actual[0]);
        }
      });
  }

  private drawDriverMarker(driverCoords: LatLngTuple): void {
    const marker = this.mapService.generateMarker(
      driverCoords,
      `assets/icons/map/${STATUS_ICONS[EmployeeLocationStatus.OrderExecution]}`,
      COURIER_ICON_RADIUS_PX,
    );

    this.map.addLayer(marker);
  }

  private drawRouteMarkers(delivery: DeliveryRecordDto): void {
    const markerCoords: LatLngTuple[] = delivery.route.points.map((route) => [route.latitude, route.longitude]);
    markerCoords?.forEach((coordinates, index) => {
      const marker = this.mapService.generateMarker(
        coordinates,
        `assets/icons/map/${GET_ROUTE_ICON(markerCoords, index)}`,
        ICON_RADIUS_PX,
      );

      marker.bindTooltip(delivery.route.points[index].address, { direction: 'top' });
      this.map.addLayer(marker);
    });
  }

  private setMapCenter(points: OrderRecordRoutePointDto[], isMobileView: boolean): void {
    const bounds = points.map(({ latitude, longitude }) => [latitude, longitude]) as LatLngTuple[];
    this.mapService.setMapCenter(bounds, isMobileView);
  }
}
