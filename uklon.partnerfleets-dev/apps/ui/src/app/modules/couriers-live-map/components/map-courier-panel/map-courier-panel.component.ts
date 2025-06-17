import { NgClass, TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatDivider } from '@angular/material/divider';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { ActiveOrderItemDto, LiveMapEmployeeDto, NearestLocationDto } from '@data-access';
import { TranslateModule } from '@ngx-translate/core';
import { CorePaths } from '@ui/core/models/core-paths';
import { DriverPaths } from '@ui/modules/drivers/models/driver-paths';
import { GROW_VERTICAL, MAT_ACCORDION_IMPORTS, StatusBadgeComponent } from '@ui/shared';
import { DefaultImgSrcDirective } from '@ui/shared/directives/default-img-src/default-img-src.directive';
import { LetDirective } from '@ui/shared/directives/let.directive';
import {
  ACTIVE_ORDER_STATUS_STYLING,
  LOCATION_STATUS_STYLING,
  MapPanelBaseDirective,
} from '@ui/shared/modules/live-map-shared';
import { MapRouteComponent } from '@ui/shared/modules/live-map-shared/components/map-route/map-route.component';
import { MapRouteDetailsComponent } from '@ui/shared/modules/live-map-shared/components/map-route-details/map-route-details.component';
import { Seconds2DatePipe } from '@ui/shared/pipes/seconds-2-date/seconds-2-date.pipe';
import { Seconds2TimePipe } from '@ui/shared/pipes/seconds-2-time/seconds-2-time.pipe';

@Component({
  selector: 'upf-map-courier-panel',
  standalone: true,
  imports: [
    MAT_ACCORDION_IMPORTS,
    MatIconButton,
    MatIcon,
    RouterLink,
    DefaultImgSrcDirective,
    StatusBadgeComponent,
    TranslateModule,
    NgClass,
    MatDivider,
    LetDirective,
    TitleCasePipe,
    Seconds2DatePipe,
    Seconds2TimePipe,
    MapRouteComponent,
    MapRouteDetailsComponent,
  ],
  templateUrl: './map-courier-panel.component.html',
  styleUrls: ['./map-courier-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [GROW_VERTICAL()],
})
export class MapCourierPanelComponent extends MapPanelBaseDirective {
  @Input() public employee: LiveMapEmployeeDto;
  @Input() public orders: ActiveOrderItemDto[] = [];
  @Input() public currentAddress: NearestLocationDto;
  @Input() public isMobileView: boolean;

  @Output() public goBack = new EventEmitter<LiveMapEmployeeDto>();
  @Output() public clearRoutes = new EventEmitter<void>();
  @Output() public selectedRoute = new EventEmitter<ActiveOrderItemDto>();
  @Output() public navigateToDelivery = new EventEmitter<void>();

  public readonly driverStatusStyling = LOCATION_STATUS_STYLING;
  public readonly orderStatusStyling = ACTIVE_ORDER_STATUS_STYLING;
  public readonly path = CorePaths;
  public readonly driverPath = DriverPaths;

  public openedPanels: Record<string, boolean> = {};

  public onGoBack(): void {
    this.goBack.emit(this.employee);
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

  public onNavigateToDelivery(): void {
    this.navigateToDelivery.emit();
  }
}
