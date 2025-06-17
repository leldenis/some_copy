import { DestroyRef, Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TicketStatus } from '@constant';
import {
  AnalyticsMapDriverStatus,
  AnalyticsMapNavigation,
  DriverOrderFilterDto,
  EmployeeLocationStatus,
  FleetAnalyticsEventType,
  LiveMapEmployeeDto,
  LiveMapLocationDto,
} from '@data-access';
import { TranslateService } from '@ngx-translate/core';
import { DriverService } from '@ui/core';
import { CorePaths } from '@ui/core/models/core-paths';
import { AnalyticsService } from '@ui/core/services/analytics.service';
import { DriverPaths } from '@ui/modules/drivers/models/driver-paths';
import { DriverFiltersPipe } from '@ui/modules/live-map/pipes/driver-filters.pipe';
import { VehiclePaths } from '@ui/modules/vehicles/models/vehicle-paths';
import { PhotoControlDeadlineMessagePipe } from '@ui/modules/vehicles/pipes/photo-control-deadline-message/photo-control-deadline-message.pipe';
import { DriverFiltersDetailsDialogComponent } from '@ui/shared/dialogs/driver-filters-details/driver-filters-details-dialog.component';
import L from 'leaflet';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { Region } from '@uklon/types';

import {
  GET_MAP_PANEL_GROUPS,
  GET_MAP_PHOTO_CONTROL_PANEL_STYING,
  GET_MAP_PHOTO_CONTROL_TEXT,
} from '../consts/live-map';

const OPTIMAL_ZOOM = 15;

@Injectable({ providedIn: 'root' })
export class LiveMapService {
  public readonly mapLayer: L.TileLayer = L.tileLayer('//{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
    maxZoom: 20,
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
  });

  private leafletMap: L.Map;

  constructor(
    private readonly router: Router,
    private readonly analytics: AnalyticsService,
    private readonly translateService: TranslateService,
    private readonly photoControlDeadlinePipe: PhotoControlDeadlineMessagePipe,
    private readonly destroyRef: DestroyRef,
    private readonly driverService: DriverService,
    private readonly dialog: MatDialog,
  ) {}

  public get map(): L.Map {
    return this.leafletMap;
  }

  public set map(map: L.Map) {
    this.leafletMap = map;
  }

  public initMap(map: L.Map): void {
    this.map = map;
    this.map.addControl(map.zoomControl.setPosition('topright'));
    this.onPopupOpened();
  }

  public disposeMap(): void {
    if (this.map) {
      this.map.clearAllEventListeners();
      this.map = null;
    }
  }

  public generateMarker(location: L.LatLngTuple, iconUrl: string, iconHalfSize: number): L.Marker {
    const icon = new L.Icon({
      iconUrl,
      iconAnchor: [iconHalfSize, iconHalfSize],
      iconSize: [iconHalfSize * 2, iconHalfSize * 2],
    });
    return L.marker(location, { icon });
  }

  public generateRoute(coords: L.LatLngExpression[], color: string, dashed = true, lineWeightPx = 4): L.Polyline {
    return L.polyline(coords, {
      stroke: true,
      color,
      weight: lineWeightPx,
      dashArray: dashed ? [8, 8] : [],
    });
  }

  public setMapCenter(
    bounds: L.LatLngTuple[],
    isMobile: boolean = false,
    zoom: number = null,
    cityCenter: LiveMapLocationDto = { latitude: 0, longitude: 0 } as LiveMapLocationDto,
  ): void {
    if (!this.map) return;

    const defaultBounds: L.LatLngTuple[] = [[cityCenter.latitude, cityCenter.longitude]];
    const mapBounds = bounds?.length > 0 ? bounds : defaultBounds;
    const mapZoom = zoom || Math.min((this.map.getBoundsZoom(mapBounds), OPTIMAL_ZOOM));

    this.fitBoundsWithOffset(mapBounds, mapZoom, isMobile);
  }

  public fitBoundsWithOffset(bounds: L.LatLngBoundsExpression, maxZoom: number, isMobile: boolean): void {
    this.map.fitBounds(bounds, { animate: false, maxZoom });

    const activeArea = document.querySelector('.active-area').getBoundingClientRect();
    const mapSize = this.map.getSize();

    const offsetPxX = (activeArea.width - mapSize.x) / 2;
    const offsetPxY = (activeArea.height - mapSize.y) / 2;
    const offsetPoint = new L.Point(offsetPxX, isMobile ? -offsetPxY : 0);

    this.map.panBy(offsetPoint, { animate: false });
  }

  public clearMarkers(markers: (L.Polyline | L.Marker)[]): void {
    if (markers?.length === 0) return;

    markers.forEach((item) => {
      item.unbindPopup();
      item.unbindTooltip();
      item.remove();
    });
  }

  public toggleMapInteractions(enable: boolean): void {
    if (enable) {
      this.map.scrollWheelZoom.enable();
      this.map.doubleClickZoom.enable();
      this.map.dragging.enable();
      return;
    }

    this.map.scrollWheelZoom.disable();
    this.map.doubleClickZoom.disable();
    this.map.dragging.disable();
  }

  public generatePopupContent(
    employee: LiveMapEmployeeDto,
    fleetId: string,
    regionId: Region,
    callback: (event: PointerEvent) => void,
  ): HTMLDivElement {
    const popupContent = L.DomUtil.create(
      'div',
      'tw-grid tw-items-center tw-grid-cols-[1fr_28px] tw-p-md tw-gap-x-10 tw-gap-y-md tw-w-80',
    );
    // eslint-disable-next-line unicorn/prefer-dom-node-dataset
    popupContent.setAttribute('data-status', employee.status);

    this.createPopupDetail(employee, fleetId, regionId, popupContent, 'tw-flex tw-items-center tw-gap-2 tw-flex-wrap');

    const viewBtn = this.createButton(
      `
         <svg class="tw-pointer-events-none" width="7" height="12" viewBox="0 0 7 12" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M7 6C7 6.3 6.9 6.5 6.7 6.7L1.7 11.7C1.3 12.1 0.7 12.1 0.3 11.7C-0.0999998 11.3 -0.0999999 10.7 0.3 10.3L4.6 6L0.3 1.7C-0.1 1.3 -0.1 0.700003 0.3 0.300003C0.7 -0.0999966 1.3 -0.0999966 1.7 0.300003L6.7 5.3C6.9 5.5 7 5.7 7 6Z" fill="#73757E"/>
        </svg>
    `,
      popupContent,
      'tw-w-7 tw-h-7 tw-border-none tw-outline-none tw-bg-neutral-silver tw-grid tw-place-content-center tw-rounded-full tw-shrink-0 tw-absolute tw-right-[18px]',
    );
    viewBtn.setAttribute('id', employee?.id);
    // @ts-expect-error @typescript-eslint/ban-ts-comment
    L.DomEvent.on(viewBtn, 'click', callback);

    if (this.isDriver(employee) && employee?.status !== EmployeeLocationStatus.Blocked) {
      this.createPhotoControlPanel(employee, popupContent);
    }

    return popupContent;
  }

  public generatePopup(
    employee: LiveMapEmployeeDto,
    fleetId: string,
    regionId: Region,
    callback: (event: PointerEvent) => void,
  ): L.Popup {
    const content = this.generatePopupContent(employee, fleetId, regionId, callback);
    const popup = new L.Popup();
    popup.setLatLng([employee.location.latitude, employee.location.latitude]);
    popup.setContent(content);

    return popup;
  }

  private createPopupDetail(
    employee: LiveMapEmployeeDto,
    fleetId: string,
    regionId: Region,
    container: HTMLDivElement,
    className: string,
  ): HTMLDivElement {
    const detail = L.DomUtil.create('div', className, container);
    detail.dataset['cy'] = 'live-map-employee-popup';

    const img = L.DomUtil.create('img', 'tw-w-9 tw-h-9 tw-rounded-full tw-object-cover', detail);
    img.src = employee?.vehicle
      ? employee.photos['driver_avatar_photo']?.url
      : employee.photos['courier_avatar_photo']?.url;

    const detailContainer = L.DomUtil.create('div', 'tw-grid tw-text-neutral-graphite tw-gap-1', detail);

    const driverName = L.DomUtil.create('div', 'tw-text-base tw-font-medium tw-cursor-pointer', detailContainer);
    driverName.innerHTML = `${employee.last_name} ${employee.first_name}`;
    L.DomEvent.on(driverName, 'click', this.navigateToDriver.bind({ self: this, employee }));

    const vehicleContainer = L.DomUtil.create('div', 'tw-flex tw-gap-2 tw-text-xs tw-leading-3', detailContainer);

    const statusClass = GET_MAP_PANEL_GROUPS().find(({ status }) => status === employee.status)?.class;
    const status = L.DomUtil.create(
      'div',
      `tw-rounded tw-px-2 tw-py-1.5 tw-uppercase ${statusClass}`,
      vehicleContainer,
    );
    status.innerHTML = this.translateService.instant(`LiveMap.DriverStatus.${employee.status}`);

    if (this.isDriver(employee)) {
      const licensePlate = L.DomUtil.create(
        'div',
        'tw-rounded tw-px-2 tw-py-1.5 tw-uppercase tw-bg-neutral-silver tw-cursor-pointer',
        vehicleContainer,
      );
      licensePlate.innerHTML = employee.vehicle.license_plate;
      L.DomEvent.on(licensePlate, 'click', this.navigateToVehicle.bind({ self: this, employee }));

      this.createFiltersInfo(employee, fleetId, regionId, detail);
    }

    return detail;
  }

  private createFiltersInfo(
    employee: LiveMapEmployeeDto,
    fleetId: string,
    regionId: Region,
    container: HTMLDivElement,
  ): void {
    const filters = L.DomUtil.create(
      'div',
      'tw-text-sm tw-whitespace-nowrap tw-text-neutral-smoke tw-cursor-pointer tw-flex tw-gap-1',
      container,
    );
    filters.innerHTML = `${this.translateService.instant('DriverFilters.Title')}: `;

    const filtersValues = L.DomUtil.create(
      'span',
      'tw-font-medium tw-text-neutral-graphite tw-flex tw-items-center',
      filters,
    );

    new DriverFiltersPipe(this.translateService)
      .transform(employee.order_accepting_methods, employee.is_device_online && !employee.is_driver_in_idle)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((res) => {
        res.forEach(({ key, data, isLink }, index) => {
          const method = L.DomUtil.create(
            'span',
            isLink ? 'tw-text-accent-mint-light hover:tw-underline' : '',
            filtersValues,
          );
          method.dataset['cy'] = `active-filter${isLink ? '-link' : ''}`;
          const comma = L.DomUtil.create('span', 'tw-mr-1', filtersValues);

          if (isLink) {
            L.DomEvent.on(
              method,
              'click',
              this.displayFiltersDetails.bind({ self: this, employee, regionId, fleetId }),
            );
          }

          method.innerHTML = this.translateService.instant(key, { data });
          comma.innerHTML = index === res.length - 1 ? '' : ',';
        });
      });
  }

  private createPhotoControlPanel(employee: LiveMapEmployeeDto, container: HTMLDivElement): HTMLDivElement | void {
    const photoControl = employee.vehicle?.photo_control;
    if (!photoControl) return;

    const { longTitle, till, days, passedDeadline } = this.photoControlDeadlinePipe.transform(
      photoControl.deadline_to_send,
    );

    const { bgColor, borderColor, textColor, iconColor } = GET_MAP_PHOTO_CONTROL_PANEL_STYING(photoControl);

    const panel = L.DomUtil.create(
      'div',
      `${borderColor} ${bgColor} tw-p-2 tw-text-neutral-graphite tw-rounded tw-border tw-col-span-full tw-font-sans`,
      container,
    );

    const header = L.DomUtil.create('div', 'tw-flex tw-gap-2 tw-items-start', panel);

    const icon = L.DomUtil.create('span', `tw-text-icon material-symbols-outlined ${iconColor}`, header);
    icon.innerHTML = 'photo_camera';

    const { title, message } = GET_MAP_PHOTO_CONTROL_TEXT(photoControl, passedDeadline);

    const panelTitle = L.DomUtil.create('div', 'tw-font-medium tw-text-base', header);
    panelTitle.innerHTML = this.translateService.instant(title);

    if (!photoControl.block_immediately) {
      const subTitle = L.DomUtil.create('div', `${textColor} tw-pl-7 tw-mt-1 tw-text-sm tw-font-medium`, panel);
      subTitle.innerHTML =
        photoControl.status === TicketStatus.REJECTED
          ? this.translateService.instant('PhotoControl.TicketStatus.Rejected')
          : this.translateService.instant(longTitle, { till, days });
    }

    const panelMessage = L.DomUtil.create('div', 'tw-text-sm tw-mt-2 tw-pl-7 tw-leading-5', panel);
    panelMessage.innerHTML = this.translateService.instant(message);

    const link = L.DomUtil.create('span', 'tw-underline tw-cursor-pointer', panelMessage);
    link.innerHTML = ` ${this.translateService.instant('PhotoControl.Tooltips.LiveMap.DriverVehicleLink')}`;
    L.DomEvent.on(link, 'click', this.navigateToVehicle.bind({ self: this, employee }));
  }

  private navigateToDriver(_: Event): void {
    const { self, employee } = this as unknown as {
      self: LiveMapService;
      employee: LiveMapEmployeeDto;
    };

    self.analytics.reportEvent<AnalyticsMapNavigation>(FleetAnalyticsEventType.LIVE_MAP_NAVIGATE_TO_DRIVER, {
      link_type: 'driver',
    });

    self.router.navigate(['/', CorePaths.WORKSPACE, CorePaths.DRIVERS, DriverPaths.DETAILS, employee?.id]);
  }

  private navigateToVehicle(_: Event): void {
    const { self, driver } = this as unknown as {
      self: LiveMapService;
      driver: LiveMapEmployeeDto;
    };

    self.analytics.reportEvent<AnalyticsMapNavigation>(FleetAnalyticsEventType.LIVE_MAP_NAVIGATE_TO_VEHICLE, {
      link_type: 'vehicle',
    });

    self.router.navigate(['/', CorePaths.WORKSPACE, CorePaths.VEHICLES, VehiclePaths.DETAILS, driver?.vehicle?.id]);
  }

  private createButton(innerHTML: string, container: HTMLDivElement, className: string): HTMLButtonElement {
    const btn = L.DomUtil.create('button', '', container);
    btn.setAttribute('type', 'button');
    btn.setAttribute('class', className);
    btn.innerHTML = innerHTML;
    return btn;
  }

  private onPopupOpened(): void {
    this.map.addEventListener('popupopen', (event: L.PopupEvent) => {
      // eslint-disable-next-line no-underscore-dangle
      const container = event.target._container as HTMLElement;
      // eslint-disable-next-line unicorn/prefer-dom-node-dataset
      const driver_status = container
        .querySelector('[data-status]')
        .getAttribute('data-status') as EmployeeLocationStatus;

      this.analytics.reportEvent<AnalyticsMapDriverStatus>(FleetAnalyticsEventType.LIVE_MAP_POPUP_OPEN_DRIVER_DETAILS, {
        driver_status,
      });
    });
  }

  private isDriver(worker: LiveMapEmployeeDto): worker is LiveMapEmployeeDto {
    return !!worker?.vehicle;
  }

  private displayFiltersDetails(_: Event): void {
    const { self, employee, regionId, fleetId } = this as unknown as {
      self: LiveMapService;
      employee: LiveMapEmployeeDto;
      regionId: Region;
      fleetId: string;
    };

    self.driverService
      .getDriverActiveFilters(fleetId, employee.id, regionId)
      .pipe(
        switchMap(({ order_filters }) => self.openFiltersDialog(order_filters, fleetId, employee.id)),
        takeUntilDestroyed(self.destroyRef),
      )
      .subscribe();
  }

  private openFiltersDialog(data: DriverOrderFilterDto[], fleet_id: string, driver_id: string): Observable<void> {
    this.analytics.reportEvent(FleetAnalyticsEventType.DRIVER_FILTERS_DETAILS_CLICK, {
      fleet_id,
      driver_id,
      page: 'live_map',
    });
    return this.dialog.open(DriverFiltersDetailsDialogComponent, { autoFocus: false, data }).afterClosed();
  }
}
