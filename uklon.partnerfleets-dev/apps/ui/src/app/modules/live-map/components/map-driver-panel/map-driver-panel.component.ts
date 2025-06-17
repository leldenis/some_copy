import { AsyncPipe, NgClass, TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatDivider } from '@angular/material/divider';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { ActiveOrderItemDto, EmployeeLocationStatus, LiveMapEmployeeDto, NearestLocationDto } from '@data-access';
import { TranslateModule } from '@ngx-translate/core';
import { CorePaths } from '@ui/core/models/core-paths';
import { DriverPaths } from '@ui/modules/drivers/models/driver-paths';
import { MapPhotoControlIconComponent } from '@ui/modules/live-map/components/map-photo-control-icon/map-photo-control-icon.component';
import { DriverFiltersPipe } from '@ui/modules/live-map/pipes/driver-filters.pipe';
import { VehiclePaths } from '@ui/modules/vehicles/models/vehicle-paths';
import { FullNamePipe, GROW_VERTICAL, MAT_ACCORDION_IMPORTS, StatusBadgeComponent } from '@ui/shared';
import { DefaultImgSrcDirective } from '@ui/shared/directives/default-img-src/default-img-src.directive';
import {
  ACTIVE_ORDER_STATUS_STYLING,
  LOCATION_STATUS_STYLING,
  MapPanelBaseDirective,
} from '@ui/shared/modules/live-map-shared';
import { MapRouteComponent } from '@ui/shared/modules/live-map-shared/components/map-route/map-route.component';
import { MapRouteDetailsComponent } from '@ui/shared/modules/live-map-shared/components/map-route-details/map-route-details.component';
import { Seconds2DatePipe } from '@ui/shared/pipes/seconds-2-date/seconds-2-date.pipe';
import { Seconds2TimePipe } from '@ui/shared/pipes/seconds-2-time/seconds-2-time.pipe';
import { NgxTippyModule } from 'ngx-tippy-wrapper';

@Component({
  selector: 'upf-map-driver-panel',
  standalone: true,
  imports: [
    MAT_ACCORDION_IMPORTS,
    MatIcon,
    RouterLink,
    DefaultImgSrcDirective,
    NgxTippyModule,
    FullNamePipe,
    StatusBadgeComponent,
    TranslateModule,
    NgClass,
    MatDivider,
    MapPhotoControlIconComponent,
    DriverFiltersPipe,
    AsyncPipe,
    Seconds2DatePipe,
    Seconds2TimePipe,
    TitleCasePipe,
    MatIconButton,
    MapRouteComponent,
    MapRouteDetailsComponent,
  ],
  templateUrl: './map-driver-panel.component.html',
  styleUrls: ['./map-driver-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [GROW_VERTICAL()],
})
export class MapDriverPanelComponent extends MapPanelBaseDirective {
  public readonly orders = input<ActiveOrderItemDto[]>([]);
  public readonly employee = input.required<LiveMapEmployeeDto>();
  public readonly currentAddress = input.required<NearestLocationDto>();
  public readonly isMobileView = input.required<boolean>();

  public readonly clearRoutes = output();
  public readonly navigateToOrder = output();
  public readonly goBack = output<LiveMapEmployeeDto>();
  public readonly selectedRoute = output<ActiveOrderItemDto>();
  public readonly showActiveFilters = output<string>();

  public readonly employeeStatusStyling = LOCATION_STATUS_STYLING;
  public readonly orderStatusStyling = ACTIVE_ORDER_STATUS_STYLING;
  public readonly path = CorePaths;
  public readonly vehiclePath = VehiclePaths;
  public readonly driverPath = DriverPaths;
  public readonly employeeStatus = EmployeeLocationStatus;

  public openedPanels: Record<string, boolean> = {};

  public onGoBack(): void {
    this.goBack.emit(this.employee());
    this.clearRoutes.emit();
  }

  public onSelectRoute(order: ActiveOrderItemDto): void {
    this.selectedRoute.emit(order);
    this.openedPanels[order.order_id] = true;
  }

  public onClosePanel(orderId: string): void {
    this.openedPanels[orderId] = false;
  }

  public onResetRoute(): void {
    const noOpenedPanels = Object.values(this.openedPanels).every((opened) => !opened);
    if (noOpenedPanels) {
      this.clearRoutes.emit();
    }
  }

  public onShowActiveFilters(employeeId: string, isLink: boolean): void {
    if (!isLink) return;

    this.showActiveFilters.emit(employeeId);
  }
}
