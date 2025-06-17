import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { Router } from '@angular/router';
import { TicketStatus } from '@constant';
import {
  AnalyticsTicketBase,
  DriverDetailsPhotoControlDto,
  DriverPhotoControlTicketDto,
  FleetAnalyticsEventType,
} from '@data-access';
import { TranslateModule } from '@ngx-translate/core';
import { CorePaths } from '@ui/core/models/core-paths';
import { AnalyticsService } from '@ui/core/services/analytics.service';
import { StorageService, userRoleKey } from '@ui/core/services/storage.service';
import { DriverPaths } from '@ui/modules/drivers/models/driver-paths';
import { PhotoControlDeadlineMessagePipe } from '@ui/modules/vehicles/pipes/photo-control-deadline-message/photo-control-deadline-message.pipe';
import { DotMarkerIconComponent } from '@ui/shared';
import { LetDirective } from '@ui/shared/directives/let.directive';
import { InfoPanelComponent } from '@ui/shared/modules/info-panel/components/info-panel/info-panel.component';
import {
  InfoPanelIconDirective,
  InfoPanelSubtitleDirective,
  InfoPanelTitleDirective,
} from '@ui/shared/modules/info-panel/directives';
import { PanelStylingPipe } from '@ui/shared/pipes/panel-styling/panel-styling.pipe';

@Component({
  selector: 'upf-driver-photo-control-panel',
  standalone: true,
  imports: [
    MatIcon,
    TranslateModule,
    LetDirective,
    PhotoControlDeadlineMessagePipe,
    PanelStylingPipe,
    DotMarkerIconComponent,
    MatButton,
    InfoPanelComponent,
    InfoPanelIconDirective,
    InfoPanelTitleDirective,
    InfoPanelSubtitleDirective,
  ],
  templateUrl: './driver-photo-control-panel.component.html',
  styleUrl: './driver-photo-control-panel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DriverPhotoControlPanelComponent {
  public photoControl = input.required<DriverPhotoControlTicketDto>();
  public driverPhotoControl = input<DriverDetailsPhotoControlDto>();

  public status = computed(() => this.photoControl().status);
  public showPhotoControlReasons = computed(
    () => ![TicketStatus.SENT, TicketStatus.REVIEW, TicketStatus.BLOCKED_BY_MANAGER].includes(this.status()),
  );
  public hasImplicitStatuses = computed(() =>
    [TicketStatus.REJECTED, TicketStatus.SENT, TicketStatus.REVIEW, TicketStatus.BLOCKED_BY_MANAGER].includes(
      this.status(),
    ),
  );
  public photoControlReason = computed(() => {
    const logs = this.photoControl().activity_log.filter(({ status }) => status === this.status());
    return logs[logs.length - 1] ?? null;
  });

  public readonly ticketStatus = TicketStatus;

  constructor(
    private readonly analytics: AnalyticsService,
    private readonly storage: StorageService,
    private readonly router: Router,
  ) {}

  public goToPhotoControl(): void {
    this.analytics.reportEvent<AnalyticsTicketBase>(FleetAnalyticsEventType.DRIVER_DETAILS_NAVIGATE_TO_PHOTO_CONTROL, {
      user_access: this.storage.get(userRoleKey),
      ticket_id: this.driverPhotoControl().ticket_id,
      page: 'Driver details - photo control',
    });

    this.router.navigate([
      '/',
      CorePaths.WORKSPACE,
      CorePaths.DRIVERS,
      DriverPaths.PHOTO_CONTROL,
      this.driverPhotoControl().ticket_id,
    ]);
  }
}
