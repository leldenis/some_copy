import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, HostBinding, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatCheckbox } from '@angular/material/checkbox';
import { MAT_DIALOG_DATA, MatDialogClose } from '@angular/material/dialog';
import { FleetAnalyticsEventType, NotificationDetailsDto, NotificationTypeValue } from '@data-access';
import { TranslateModule } from '@ngx-translate/core';
import { AnalyticsService } from '@ui/core/services/analytics.service';
import { fleetIdKey, StorageService, userRoleKey } from '@ui/core/services/storage.service';
import { ReplaceNbspPipe } from '@ui/shared';

import { UklAngularCoreModule } from '@uklon/angular-core';

@Component({
  selector: 'upf-notification-details-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatButton,
    MatCheckbox,
    ReactiveFormsModule,
    MatDialogClose,
    TranslateModule,
    UklAngularCoreModule,
    ReplaceNbspPipe,
  ],
  templateUrl: './notification-details-dialog.component.html',
  styleUrl: './notification-details-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class NotificationDetailsDialogComponent implements OnInit {
  @HostBinding('attr.data-cy')
  public readonly attribute = 'notification-details-dialog';

  public readonly acceptanceControl = new FormControl<boolean>(false, Validators.requiredTrue);
  public readonly notificationType = NotificationTypeValue;

  constructor(
    private readonly analytics: AnalyticsService,
    private readonly storage: StorageService,
    @Inject(MAT_DIALOG_DATA) public data: NotificationDetailsDto,
  ) {}

  public get acceptanceRequired(): boolean {
    return this.data.type === NotificationTypeValue.ACCEPTANCE_REQUIRED && !this.data.accepted_at;
  }

  public ngOnInit(): void {
    this.analytics.reportEvent(FleetAnalyticsEventType.NOTIFICATION_DESCRIPTION_POPUP, {
      notification_type: this.data.type,
      notification_id: this.data.id,
      image_present: Boolean(this.data.image_base_64),
      user_access: this.storage.get(userRoleKey),
      fleet_id: this.storage.get(fleetIdKey),
      page: 'notification_details_popup',
    });
  }
}
