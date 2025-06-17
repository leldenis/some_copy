import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { AsyncPipe, NgClass, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatDivider } from '@angular/material/divider';
import { MatIcon } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';
import { BlockedListStatusValue, TicketStatus } from '@constant';
import { AnalyticsVehicleBase, FleetAnalyticsEventType, VehiclePhotoControlTicketItemDto } from '@data-access';
import { TranslateModule } from '@ngx-translate/core';
import { CorePaths } from '@ui/core/models/core-paths';
import { AnalyticsService } from '@ui/core/services/analytics.service';
import { DeviceService } from '@ui/core/services/device.service';
import { StorageService, userRoleKey } from '@ui/core/services/storage.service';
import { VehiclePaths } from '@ui/modules/vehicles/models/vehicle-paths';
import { PhotoControlDeadlineMessagePipe } from '@ui/modules/vehicles/pipes/photo-control-deadline-message/photo-control-deadline-message.pipe';
import { MAT_ACCORDION_IMPORTS, StatusBadgeComponent } from '@ui/shared';
import { PHOTO_CONTROL_TICKET_STATUS_COLOR } from '@ui/shared/consts';
import { NgxTippyModule } from 'ngx-tippy-wrapper';
import { map, Observable } from 'rxjs';

const MOBILE_BREAKPOINT = '767px';

@Component({
  selector: 'upf-vehicles-photo-control-list',
  standalone: true,
  imports: [
    MAT_ACCORDION_IMPORTS,
    TranslateModule,
    AsyncPipe,
    StatusBadgeComponent,
    NgClass,
    NgxTippyModule,
    MatIcon,
    MatDivider,
    RouterLink,
    NgTemplateOutlet,
    PhotoControlDeadlineMessagePipe,
  ],
  providers: [DeviceService],
  templateUrl: './vehicles-photo-control-list.component.html',
  styleUrls: ['./vehicles-photo-control-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VehiclesPhotoControlListComponent {
  @Input() public tickets: VehiclePhotoControlTicketItemDto[] = [];

  public readonly path = CorePaths;
  public readonly vehiclePath = VehiclePaths;
  public readonly ticketStatus = TicketStatus;
  public readonly blockedStatus = BlockedListStatusValue;
  public readonly statusColor = PHOTO_CONTROL_TICKET_STATUS_COLOR;
  public readonly isDesktop = !this.deviceService.isIos() && !this.deviceService.isAndroid();
  public isMobileView$: Observable<boolean> = this.breakpointObserver
    .observe([`(max-width: ${MOBILE_BREAKPOINT})`])
    .pipe(map((breakpointState: BreakpointState) => breakpointState.matches));

  constructor(
    private readonly breakpointObserver: BreakpointObserver,
    private readonly deviceService: DeviceService,
    private readonly router: Router,
    private readonly analytics: AnalyticsService,
    private readonly storage: StorageService,
  ) {}

  public navigateToPhotoControl(ticketId: string, vehicleId: string): void {
    if (this.isDesktop) return;

    this.analytics.reportEvent<AnalyticsVehicleBase>(
      FleetAnalyticsEventType.FLEET_PHOTO_CONTROL_LIST_NAVIGATE_TO_PHOTO_CONTROL,
      {
        user_access: this.storage.get(userRoleKey),
        vehicle_id: vehicleId,
      },
    );
    this.router.navigate(['/', CorePaths.WORKSPACE, CorePaths.VEHICLES, VehiclePaths.PHOTO_CONTROL, ticketId]);
  }
}
