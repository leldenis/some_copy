import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { TicketStatus } from '@constant';
import {
  AnalyticsVehicleBase,
  FleetAnalyticsEventType,
  VehicleDetailsPhotoControlDto,
  VehiclePhotoControlTicketDto,
} from '@data-access';
import { TranslateModule } from '@ngx-translate/core';
import { AnalyticsService } from '@ui/core/services/analytics.service';
import { DeviceService } from '@ui/core/services/device.service';
import { StorageService, userRoleKey } from '@ui/core/services/storage.service';
import { VehiclePaths } from '@ui/modules/vehicles/models/vehicle-paths';
import { PhotoControlDeadlineMessagePipe } from '@ui/modules/vehicles/pipes/photo-control-deadline-message/photo-control-deadline-message.pipe';
import { DotMarkerIconComponent, PanelStylingPipe } from '@ui/shared';
import { LetDirective } from '@ui/shared/directives/let.directive';
import { InfoPanelComponent } from '@ui/shared/modules/info-panel/components/info-panel/info-panel.component';
import {
  InfoPanelIconDirective,
  InfoPanelSubtitleDirective,
  InfoPanelTitleDirective,
} from '@ui/shared/modules/info-panel/directives';
import { NgxTippyModule } from 'ngx-tippy-wrapper';

@Component({
  selector: 'upf-vehicle-photo-control-panel',
  standalone: true,
  imports: [
    MatIconModule,
    MatButtonModule,
    NgxTippyModule,
    TranslateModule,
    LetDirective,
    PhotoControlDeadlineMessagePipe,
    RouterModule,
    DotMarkerIconComponent,
    PanelStylingPipe,
    InfoPanelComponent,
    InfoPanelIconDirective,
    InfoPanelTitleDirective,
    InfoPanelSubtitleDirective,
  ],
  templateUrl: './vehicle-photo-control-panel.component.html',
  styleUrls: ['./vehicle-photo-control-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DeviceService],
})
export class VehiclePhotoControlPanelComponent implements OnInit {
  @Input() public photoControl: VehiclePhotoControlTicketDto;
  @Input() public vehiclePhotoControl?: VehicleDetailsPhotoControlDto;

  public readonly vehiclePaths = VehiclePaths;
  public readonly ticketStatus = TicketStatus;
  public readonly isDesktop = !this.deviceService.isIos() && !this.deviceService.isAndroid();
  public readonly implicitStatuses = new Set([
    TicketStatus.REJECTED,
    TicketStatus.SENT,
    TicketStatus.REVIEW,
    TicketStatus.BLOCKED_BY_MANAGER,
  ]);
  public clarificationReason: string;
  public clarificationReasonCustomComment: string;
  public rejectionReason: string;

  constructor(
    private readonly deviceService: DeviceService,
    private readonly analytics: AnalyticsService,
    private readonly storage: StorageService,
  ) {}

  public ngOnInit(): void {
    this.initVariables(this.photoControl);
  }

  public reportPhotoControlNavigation(vehicleId: string): void {
    this.analytics.reportEvent<AnalyticsVehicleBase>(
      FleetAnalyticsEventType.VEHICLE_DETAILS_NAVIGATE_TO_PHOTO_CONTROL,
      {
        user_access: this.storage.get(userRoleKey),
        vehicle_id: vehicleId,
      },
    );
  }

  private initVariables(ticket: VehiclePhotoControlTicketDto): void {
    if (ticket.status === TicketStatus.CLARIFICATION) {
      const clarifications = ticket?.activity_log
        .slice()
        .reverse()
        .find(({ status }) => status === TicketStatus.CLARIFICATION);

      if (clarifications) {
        this.clarificationReason = clarifications?.comment;
        this.clarificationReasonCustomComment = clarifications?.clarification_details?.comment;
      }
    }

    if (ticket.status === TicketStatus.REJECTED) {
      const rejections = ticket?.activity_log.filter(({ status }) => status === TicketStatus.REJECTED);
      this.rejectionReason = rejections.pop()?.comment;
    }
  }
}
