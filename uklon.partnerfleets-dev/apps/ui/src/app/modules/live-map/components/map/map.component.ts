import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  EventEmitter,
  inject,
  Inject,
  Input,
  OnDestroy,
  Output,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import {
  ActiveOrderItemDto,
  AnalyticsBase,
  AnalyticsMapDriversSelected,
  AnalyticsMapFullScreen,
  AnalyticsMapNavigation,
  AnalyticsMapOrderStatus,
  AnalyticsMapSearch,
  AnalyticsMapTogglePanel,
  DriverOrderFilterDto,
  EmployeeLocationStatus,
  FleetAnalyticsEventType,
  LiveMapEmployeeDto,
  LiveMapLocationDto,
} from '@data-access';
import { decode } from '@googlemaps/polyline-codec';
import { TranslateModule } from '@ngx-translate/core';
import { DriverService } from '@ui/core';
import { CorePaths } from '@ui/core/models/core-paths';
import { AnalyticsService } from '@ui/core/services/analytics.service';
import { AppTranslateService } from '@ui/core/services/app-translate.service';
import { CourierPaths } from '@ui/modules/couriers/models/courier-paths';
import { DriverPaths } from '@ui/modules/drivers/models/driver-paths';
import { MapDriverPanelComponent } from '@ui/modules/live-map/components/map-driver-panel/map-driver-panel.component';
import { MapDriversPanelComponent } from '@ui/modules/live-map/components/map-drivers-panel/map-drivers-panel.component';
import { MapPanelComponent } from '@ui/modules/live-map/components/map-panel/map-panel.component';
import { MapSearchComponent } from '@ui/modules/live-map/components/map-search/map-search.component';
import { OrdersPaths } from '@ui/modules/orders/models/orders-paths';
import { OrdersService } from '@ui/modules/orders/services';
import { TO_FILTER_FORMAT } from '@ui/shared';
import { DriverFiltersDetailsDialogComponent } from '@ui/shared/dialogs/driver-filters-details/driver-filters-details-dialog.component';
import { LetDirective } from '@ui/shared/directives/let.directive';
import {
  FRAGMENT_TO_STATE,
  GeolocationService,
  GET_ROUTE_ICON,
  LIVE_MAP_TYPE,
  LiveMapPanelType,
  LiveMapService,
  LiveMapType,
  MapPanelState,
  PANEL_STATE_ZOOM,
  PanelFragment,
  ROUTE_COLOR,
  STATUS_ICONS,
  ToggleMapInteractionsDirective,
} from '@ui/shared/modules/live-map-shared';
import { MapTripComponent } from '@ui/shared/modules/live-map-shared/components/map-trip/map-trip.component';
import * as L from 'leaflet';
import { BehaviorSubject, combineLatest, Observable, startWith } from 'rxjs';
import { filter, map, switchMap, tap } from 'rxjs/operators';

import { toServerDate } from '@uklon/angular-core';
import { Region } from '@uklon/types';

const MAX_POPUP_WIDTH_PX = 350;
const ICON_RADIUS_PX = 12;
const ICON_PATH = (icon: string): string => `assets/icons/map/${icon}`;

@Component({
  selector: 'upf-map',
  standalone: true,
  imports: [
    AsyncPipe,
    LeafletModule,
    ToggleMapInteractionsDirective,
    MatIcon,
    TranslateModule,
    LetDirective,
    MapDriversPanelComponent,
    MapTripComponent,
    MapSearchComponent,
    MapPanelComponent,
    MapDriverPanelComponent,
  ],
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapComponent implements OnDestroy {
  @Input() public cityCenter: LiveMapLocationDto;
  @Input() public isMobileView: boolean;
  @Input() public lastRefreshed: number;
  @Input() public regionId: Region;

  @Input() public set mapData({ employees, fleetId }: { employees: LiveMapEmployeeDto[]; fleetId: string }) {
    this.handleMapDataChange(employees, fleetId);
  }

  @Output() public resetFilters = new EventEmitter<void>();
  @Output() public toggleFullScreen = new EventEmitter<boolean>();

  public readonly state = MapPanelState;
  public readonly mapLayer = this.mapService.mapLayer;
  public readonly markersMap = new Map<string, L.Marker>();

  public mapOptions: L.MapOptions = {
    layers: [this.mapLayer],
    zoom: 12,
    minZoom: 10,
    maxZoom: 20,
    center: [0, 0],
  };
  public searchMode = false;
  public routeMarkers: (L.Polyline | L.Marker)[] = [];
  public isFullScreen = false;
  public currentFragment: MapPanelState;

  protected fleetId: string;
  protected mapRoute: CorePaths[];
  // eslint-disable-next-line unicorn/prefer-spread
  protected readonly containers: HTMLElement[] = Array.from(document.querySelectorAll('html, body'));

  // Employees
  public readonly locale$: Observable<string> = this.appTranslateService.currentLang$.pipe(
    tap(() => this.onLocaleChange()),
  );
  public readonly employees$ = new BehaviorSubject<LiveMapEmployeeDto[]>([]);
  public readonly allEmployees$ = new BehaviorSubject<LiveMapEmployeeDto[]>([]);
  public readonly selectedEmployee$ = this.route.queryParams.pipe(
    filter(({ employeeId }) => employeeId),
    switchMap(({ employeeId }) =>
      this.allEmployees$.pipe(map((employees) => employees.find(({ id }) => id === employeeId))),
    ),
    filter(Boolean),
  );
  public readonly filteredEmployees$ = this.route.queryParams.pipe(
    filter(() => this.searchMode),
    switchMap(({ name, licensePlate }) =>
      this.allEmployees$.pipe(
        map((employees) => employees.filter((employee) => this.filterFn(employee, licensePlate, name))),
      ),
    ),
    tap((employees) => this.onFilterEmployees(employees)),
  );
  public readonly employeeAddress$ = combineLatest([this.selectedEmployee$, this.locale$]).pipe(
    filter(([employee]) => !!employee?.location),
    map(([{ location }]) => location),
    switchMap(({ latitude, longitude }) =>
      this.geoService.getAddress(latitude, longitude, this.appTranslateService.currentLang),
    ),
  );

  // Orders
  public readonly selectedOrder$ = new BehaviorSubject<ActiveOrderItemDto>(null);
  public readonly activeOrders$ = new BehaviorSubject<ActiveOrderItemDto[]>([]);

  // Routing
  public readonly fragment$ = this.route.fragment.pipe(
    startWith(this.route.snapshot.fragment || 'home'),
    filter(Boolean),
    map((fragment) => FRAGMENT_TO_STATE[fragment as PanelFragment]),
  );
  public readonly params$ = combineLatest([this.allEmployees$, this.route.queryParams, this.fragment$]).pipe(
    filter(([employees, params]) => employees && !!params),
    map(([employees, params, fragment]) => ({ employees, params, fragment })),
    tap(({ fragment }) => this.handleParams(fragment)),
  );

  private readonly driversService = inject(DriverService);
  private readonly dialog = inject(MatDialog);

  constructor(
    protected readonly mapService: LiveMapService,
    protected readonly geoService: GeolocationService,
    protected readonly ordersService: OrdersService,
    protected readonly appTranslateService: AppTranslateService,
    protected readonly analytics: AnalyticsService,
    protected readonly router: Router,
    protected readonly route: ActivatedRoute,
    protected readonly destroyRef: DestroyRef,
    @Inject(LIVE_MAP_TYPE) protected readonly mapType: LiveMapType,
  ) {
    this.mapRoute = this.isDriverMap
      ? [CorePaths.WORKSPACE, CorePaths.LIVE_MAP]
      : [CorePaths.WORKSPACE, CorePaths.COURIERS, CorePaths.LIVE_MAP];
  }

  protected get map(): L.Map {
    return this.mapService.map;
  }

  protected get isDriverMap(): boolean {
    return this.mapType === LiveMapType.DRIVER;
  }

  protected get employees(): LiveMapEmployeeDto[] {
    return this.employees$.getValue();
  }

  public ngOnDestroy(): void {
    this.mapService.disposeMap();
    this.togglePageOverflow(true);
  }

  protected panelsNavigation(fragment: PanelFragment, params: Record<string, string | null> = null): void {
    const queryParams = params ?? { status: null, employeeId: null };

    this.router.navigate(this.mapRoute, {
      fragment,
      queryParams,
      queryParamsHandling: 'merge',
    });

    if (fragment === 'employeesList') {
      const eventType = this.isDriverMap
        ? FleetAnalyticsEventType.LIVE_MAP_DRIVERS_GROUP_SELECTED
        : FleetAnalyticsEventType.COURIERS_LIVE_MAP_DRIVERS_GROUP_SELECTED;

      this.analytics.reportEvent<AnalyticsMapDriversSelected>(eventType, {
        drivers_list_status: this.employees[0]?.status,
      });
    }
  }

  public handleParams(fragment: MapPanelState): void {
    const { name, licensePlate, status, employeeId } = this.route.snapshot.queryParams;
    const employees = this.allEmployees$.getValue();
    const isTripView = fragment === MapPanelState.ActiveOrder && this.isMobileView;

    this.searchMode = name || licensePlate;
    this.handleStatus(status, employees);
    this.handleEmployeeId(employeeId, status, employees, fragment, isTripView);
    this.initMarkers();

    if (this.currentFragment === fragment || isTripView) return;

    this.setMapCenter();
    this.currentFragment = fragment;
  }

  protected handleStatus(employeeStatus: EmployeeLocationStatus, employees: LiveMapEmployeeDto[]): void {
    let grouped: LiveMapEmployeeDto[] = [];

    if (employeeStatus) {
      grouped = employees.filter(({ status }) => employeeStatus === status);
      this.employees$.next(grouped);
    }

    if ((grouped?.length === 0 && this.currentFragment !== MapPanelState.EmployeeDetails) || !employeeStatus)
      this.goHome();
  }

  protected handleEmployeeId(
    employeeId: string,
    status: EmployeeLocationStatus,
    employees: LiveMapEmployeeDto[],
    fragment: MapPanelState,
    isTripView = false,
  ): void {
    if (!employeeId) {
      return;
    }

    const employee = employees.find(({ id }) => id === employeeId);

    if (!employee) {
      this.goHome();
      return;
    }

    this.employees$.next([employee]);

    if (this.shouldNavigateToEmployeeDetails(isTripView, employee)) {
      this.panelsNavigation('employeeDetails', { status, employeeId });
    }

    if (!this.searchMode && this.currentFragment === fragment) {
      this.getActiveOrdersDetails(employee);
    }
  }

  protected onFilterEmployees(employees: LiveMapEmployeeDto[]): void {
    this.employees$.next(employees);
    this.onClearRoutes(false);
    this.initMarkers();
    this.reportFilteredEmployees(employees);
  }

  protected goHome(): void {
    this.panelsNavigation('home');
    this.employees$.next(this.allEmployees$.getValue());
  }

  protected filterFn({ first_name, last_name, vehicle }: LiveMapEmployeeDto, plate: string, name: string): boolean {
    return (
      TO_FILTER_FORMAT(`${first_name}${last_name}`).includes(TO_FILTER_FORMAT(name)) &&
      TO_FILTER_FORMAT(vehicle.license_plate).includes(TO_FILTER_FORMAT(plate))
    );
  }

  public onMapReady(leafletMap: L.Map): void {
    this.mapService.initMap(leafletMap);
    this.initMarkers();
    this.setMapCenter();
  }

  public onSelectRoute(order: ActiveOrderItemDto): void {
    if (this.isMobileView) {
      const { status, employeeId } = this.route.snapshot.queryParams;
      this.panelsNavigation('activeOrder', { status, employeeId });
    }

    if (JSON.stringify(order) === JSON.stringify(this.selectedOrder$.getValue())) return;

    this.selectedOrder$.next(order);
    this.clearMarkers(this.routeMarkers);
    this.drawSystemRoute(order);
    this.drawActualRoute(order.pickup_time);
    this.drawRouteMarkers(order);

    const eventType = this.isDriverMap
      ? FleetAnalyticsEventType.LIVE_MAP_TOGGLE_ACTIVE_ORDER
      : FleetAnalyticsEventType.COURIERS_LIVE_MAP_TOGGLE_ACTIVE_ORDER;

    this.analytics.reportEvent<AnalyticsMapOrderStatus>(eventType, { ride_status: order?.status });
  }

  public onSelectEmployee({ status, id }: LiveMapEmployeeDto): void {
    this.panelsNavigation('employeeDetails', { status, employeeId: id });
    if (this.searchMode) this.onCloseSearch();
    this.activeOrders$.next([]);
    this.selectedOrder$.next(null);

    const eventType = this.isDriverMap
      ? FleetAnalyticsEventType.LIVE_MAP_DRIVER_SELECTED
      : FleetAnalyticsEventType.COURIERS_LIVE_MAP_COURIER_SELECTED;
    this.analytics.reportEvent<AnalyticsBase>(eventType);
  }

  public onCloseSearch(report = false): void {
    this.searchMode = false;
    this.initMarkers();
    this.resetFilters.emit();

    if (report) {
      const eventType = this.isDriverMap
        ? FleetAnalyticsEventType.LIVE_MAP_SEARCH_BACK_BTN
        : FleetAnalyticsEventType.COURIERS_LIVE_MAP_SEARCH_BACK_BTN;
      this.analytics.reportEvent<AnalyticsBase>(eventType);
    }
  }

  public onClearRoutes(setMapCenter = true): void {
    this.selectedOrder$.next(null);
    this.clearMarkers(this.routeMarkers);
    if (setMapCenter) this.setMapCenter();
  }

  public clearMarkers(markers: (L.Polyline | L.Marker)[]): void {
    this.mapService.clearMarkers(markers);
  }

  public onToggleFullScreen(): void {
    this.isFullScreen = !this.isFullScreen;
    this.toggleFullScreen.emit(this.isFullScreen);
    this.togglePageOverflow(!this.isFullScreen);

    const eventType = this.isDriverMap
      ? FleetAnalyticsEventType.LIVE_MAP_TOGGLE_FULL_SCREEN
      : FleetAnalyticsEventType.COURIERS_LIVE_MAP_TOGGLE_FULL_SCREEN;
    this.analytics.reportEvent<AnalyticsMapFullScreen>(eventType, { fullScreen: this.isFullScreen ? 'on' : 'off' });
  }

  public enableMapInteractions(): void {
    this.mapService.toggleMapInteractions(true);
  }

  public reportPanelOpened(event: { state: boolean; type: LiveMapPanelType }): void {
    const eventType = this.isDriverMap
      ? FleetAnalyticsEventType.LIVE_MAP_TOGGLE_PANEL
      : FleetAnalyticsEventType.COURIERS_LIVE_MAP_TOGGLE_PANEL;

    this.analytics.reportEvent<AnalyticsMapTogglePanel>(eventType, {
      view: event.state ? 'opened' : 'closed',
      panel: event.type,
    });
  }

  public onNavigateToEntity(id: string): void {
    const route = this.isDriverMap
      ? ['/', CorePaths.WORKSPACE, DriverPaths.DETAILS, id]
      : ['/', CorePaths.WORKSPACE, CorePaths.COURIERS, CourierPaths.DETAILS, id];

    this.router.navigate(route);
  }

  public onNavigateToOrder(orderId: string, employeeId: string): void {
    this.router.navigate(['/', CorePaths.WORKSPACE, CorePaths.ORDERS, OrdersPaths.DETAILS, orderId], {
      queryParams: { [this.isDriverMap ? 'driverId' : 'courierId']: employeeId },
    });
  }

  public getDriverActiveFilters(employeeId: string): void {
    this.driversService
      .getDriverActiveFilters(this.fleetId, employeeId, this.regionId)
      .pipe(
        switchMap(({ order_filters }) => this.openFiltersDialog(order_filters, employeeId)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }

  protected togglePageOverflow(enable: boolean): void {
    this.containers.forEach(({ style }) => {
      // eslint-disable-next-line no-param-reassign
      style.overscrollBehaviorY = enable ? 'auto' : 'none';
    });
  }

  protected onLocaleChange(): void {
    if (!this.map) return;

    this.map.closePopup();
    this.initMarkers();
  }

  protected handleMapDataChange(employees: LiveMapEmployeeDto[], fleetId: string): void {
    this.allEmployees$.next(employees);
    this.handleFleetChange(fleetId);
  }

  protected handleFleetChange(fleetId: string): void {
    if (!this.fleetId) {
      this.fleetId = fleetId;
      return;
    }

    if (this.fleetId !== fleetId) {
      if (this.searchMode) this.onCloseSearch();
      this.panelsNavigation('home');
      this.initMarkers(true);
      this.setMapCenter();
    }

    this.fleetId = fleetId;
  }

  protected getActiveOrdersDetails(employee: LiveMapEmployeeDto): void {
    if (!employee?.active_orders?.length) {
      this.activeOrders$.next([]);
      this.clearMarkers(this.routeMarkers);
      return;
    }

    const request$ = this.isDriverMap
      ? this.ordersService.getDriverActiveOrders(employee.id)
      : this.ordersService.getCourierActiveOrders(employee.id, this.fleetId);

    request$
      .pipe(
        tap(() => {
          const selected = this.selectedOrder$.getValue();
          if (!selected) return;
          this.drawActualRoute(selected?.pickup_time);
        }),
        filter((orders) => JSON.stringify(orders) !== JSON.stringify(this.activeOrders$.getValue())),
        tap((orders) => this.activeOrders$.next(orders)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }

  protected drawSystemRoute(order: ActiveOrderItemDto): void {
    const points = decode(order?.route?.overwiew_polyline ?? '');

    if (!points?.length) return;

    this.setMapCenter(points);

    const systemRoute = this.mapService.generateRoute(points, ROUTE_COLOR.SYSTEM, false, 8);
    const border = this.mapService.generateRoute(points, ROUTE_COLOR.BORDER, false, 12);

    this.routeMarkers.push(systemRoute, border);
    this.map.addLayer(border).addLayer(systemRoute);
  }

  protected drawActualRoute(from: number): void {
    const to = toServerDate(new Date());

    if (from > to || !this.employees?.length) return;

    this.geoService
      .getEmployeeLocationInTimeframe(this.employees[0].id, from, toServerDate(new Date(this.lastRefreshed)))
      .pipe(filter((locations) => locations?.length > 0))
      .subscribe((locations) => {
        const actual = locations.map(({ location: { coordinates } }) => coordinates.reverse() as L.LatLngTuple);
        const actualRoute = this.mapService.generateRoute(actual, ROUTE_COLOR.ACTUAL);
        this.map?.addLayer(actualRoute);
        this.routeMarkers.push(actualRoute);
      });
  }

  protected drawRouteMarkers(order: ActiveOrderItemDto): void {
    const markerCoords: L.LatLngTuple[] = order.route.route_points.map((route) => [route.lat, route.lng]);
    markerCoords?.forEach((coordinates, index) => {
      const marker = this.mapService.generateMarker(
        coordinates,
        ICON_PATH(GET_ROUTE_ICON(markerCoords, index)),
        ICON_RADIUS_PX,
      );

      marker.bindTooltip(order.route.route_points[index].address_name, { direction: 'top' });
      this.map.addLayer(marker);
      this.routeMarkers.push(marker);
    });
  }

  protected initMarkers(reset = false): void {
    if (!this.map) return;

    if (reset) {
      this.clearMarkers([...this.markersMap.values(), ...this.routeMarkers]);
      this.markersMap.clear();
    } else {
      this.deleteOldMarkers();
    }

    this.employees.forEach((employee) => {
      const { location, id } = employee;
      const currentMarker = this.markersMap.get(id);

      if (currentMarker && !location) {
        currentMarker.closePopup();
        this.clearMarkers([currentMarker]);
        this.markersMap.delete(id);
        return;
      }

      if (currentMarker && location) {
        this.updateMarkerLocation(currentMarker, employee);
        return;
      }

      if (!currentMarker && location) this.createNewMarker(employee);
    });
  }

  protected deleteOldMarkers(): void {
    const ids: string[] = [];

    this.markersMap.forEach((marker, key) => {
      const markerExists = this.employees.find(({ id }) => id === key);
      if (markerExists) return;

      marker.closePopup();
      this.clearMarkers([marker]);
      ids.push(key);
    });

    if (ids.length === 0) return;

    ids.forEach((id) => this.markersMap.delete(id));
  }

  protected updateMarkerLocation(marker: L.Marker, employee: LiveMapEmployeeDto): void {
    const {
      location: { latitude, longitude },
      status,
    } = employee;
    const icons = marker.getIcon().options.iconUrl.split('/');
    const currentIcon = icons[icons.length - 1];
    marker.setLatLng([latitude, longitude]);

    if (currentIcon !== STATUS_ICONS[status]) {
      marker.setIcon(new L.Icon({ iconUrl: ICON_PATH(STATUS_ICONS[status]) }));
    }

    if (!marker.isPopupOpen()) return;
    marker.getPopup().setLatLng([latitude, longitude]);
    marker
      .getPopup()
      .setContent(
        this.mapService.generatePopupContent(employee, this.fleetId, this.regionId, this.onPopupBtnClick.bind(this)),
      );
  }

  protected createNewMarker(employee: LiveMapEmployeeDto): void {
    const {
      location: { latitude, longitude },
      id,
      status,
    } = employee;

    const marker = this.mapService.generateMarker([latitude, longitude], ICON_PATH(STATUS_ICONS[status]), 14);
    this.generatePopup(marker, employee);
    this.markersMap.set(id, marker);
    this.map.addLayer(marker);
  }

  protected generatePopup(marker: L.Marker, employee: LiveMapEmployeeDto): void {
    marker.bindPopup(
      this.mapService.generatePopup(employee, this.fleetId, this.regionId, this.onPopupBtnClick.bind(this)),
      {
        closeButton: false,
        maxWidth: MAX_POPUP_WIDTH_PX,
      },
    );
  }

  protected onPopupBtnClick(event: PointerEvent): void {
    const employeeId = (event.target as HTMLElement).id;
    const employee = this.employees.find(({ id }) => id === employeeId);

    if (!employee) return;

    this.map.closePopup();
    this.onSelectEmployee(employee);

    const eventType = this.isDriverMap
      ? FleetAnalyticsEventType.LIVE_MAP_POPUP_OPEN_DRIVER_DETAILS
      : FleetAnalyticsEventType.COURIERS_LIVE_MAP_POPUP_OPEN_DRIVER_DETAILS;
    this.analytics.reportEvent<AnalyticsMapNavigation>(eventType, { link_type: 'driver_map' });
  }

  protected reportFilteredEmployees(employees: LiveMapEmployeeDto[]): void {
    const eventType = this.isDriverMap
      ? FleetAnalyticsEventType.LIVE_MAP_DRIVERS_SEARCH
      : FleetAnalyticsEventType.COURIERS_LIVE_MAP_DRIVERS_SEARCH;
    this.analytics.reportEvent<AnalyticsMapSearch>(eventType, { drivers_count: employees?.length });
  }

  protected setMapCenter(bounds: L.LatLngTuple[] = null): void {
    const mapBounds =
      bounds ??
      (this.employees
        .filter((driver) => driver?.status !== EmployeeLocationStatus.Inactive && !!driver?.location)
        .map(({ location: { latitude, longitude } }) => [latitude, longitude]) as L.LatLngTuple[]);

    this.mapService.setMapCenter(
      mapBounds,
      this.isMobileView,
      PANEL_STATE_ZOOM[(this.route.snapshot.fragment as PanelFragment) || 'home'],
      this.cityCenter,
    );
  }

  private shouldNavigateToEmployeeDetails(isTripView: boolean, employee: LiveMapEmployeeDto): boolean {
    const selectedOrder = this.selectedOrder$.getValue();
    return (
      isTripView && (!selectedOrder || (selectedOrder && employee?.status !== EmployeeLocationStatus.OrderExecution))
    );
  }

  private openFiltersDialog(data: DriverOrderFilterDto[], driverId: string): Observable<void> {
    this.analytics.reportEvent(FleetAnalyticsEventType.DRIVER_FILTERS_DETAILS_CLICK, {
      fleet_id: this.fleetId,
      driver_id: driverId,
      page: 'live_map',
    });

    return this.dialog.open(DriverFiltersDetailsDialogComponent, { autoFocus: false, data }).afterClosed();
  }
}
