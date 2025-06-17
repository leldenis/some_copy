import { AsyncPipe, NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import {
  AnalyticsHistoryEventType,
  AnalyticsHistoryEventTypeDetails,
  FleetAnalyticsEventType,
  FleetHistoryChangeItemDto,
  FleetHistoryType,
  HistoryInitiatorType,
} from '@data-access';
import { TranslateModule } from '@ngx-translate/core';
import { AnalyticsService } from '@ui/core/services/analytics.service';
import { StorageService, userRoleKey } from '@ui/core/services/storage.service';
import { FleetHistoryDetailsComponent } from '@ui/modules/fleet-profile/features/fleet-history/components/fleet-history-details/fleet-history-details.component';
import { MAT_ACCORDION_IMPORTS, ProgressSpinnerComponent } from '@ui/shared';
import { Seconds2DatePipe } from '@ui/shared/pipes/seconds-2-date/seconds-2-date.pipe';
import { Seconds2TimePipe } from '@ui/shared/pipes/seconds-2-time/seconds-2-time.pipe';
import { Observable } from 'rxjs';

@Component({
  selector: 'upf-fleet-history-list',
  standalone: true,
  imports: [
    MAT_ACCORDION_IMPORTS,
    TranslateModule,
    NgClass,
    Seconds2DatePipe,
    Seconds2TimePipe,
    MatIcon,
    AsyncPipe,
    FleetHistoryDetailsComponent,
    ProgressSpinnerComponent,
  ],
  templateUrl: './fleet-history-list.component.html',
  styleUrls: ['./fleet-history-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FleetHistoryListComponent {
  public history = input<FleetHistoryChangeItemDto[]>([]);
  public isLoading = input(false);
  public additionalInfo = input<Map<string, Observable<FleetHistoryChangeItemDto>>>();

  public getFullInfo = output<FleetHistoryChangeItemDto>();

  public readonly initiatorType = HistoryInitiatorType;
  public readonly removeChanges = new Set<FleetHistoryType>([
    FleetHistoryType.DRIVER_REMOVED,
    FleetHistoryType.VEHICLE_REMOVED,
    FleetHistoryType.OWNER_DELETED,
    FleetHistoryType.MANAGER_DELETED,
  ]);

  private readonly analytics = inject(AnalyticsService);
  private readonly storage = inject(StorageService);

  private get userRole(): string {
    return this.storage.get(userRoleKey);
  }

  public onGetFullInfo(change: FleetHistoryChangeItemDto): void {
    this.getFullInfo.emit(change);
  }

  public reportPanelOpened({ change_type, details }: FleetHistoryChangeItemDto): void {
    this.analytics.reportEvent<AnalyticsHistoryEventTypeDetails>(
      FleetAnalyticsEventType.FLEET_PROFILE_HISTORY_DETAILS_OPENED,
      {
        user_access: this.userRole,
        history_event_type: change_type,
        history_details_info: details,
      },
    );
  }

  public reportPanelClosed(eventType: FleetHistoryType): void {
    this.analytics.reportEvent<AnalyticsHistoryEventType>(
      FleetAnalyticsEventType.FLEET_PROFILE_HISTORY_DETAILS_CLOSED,
      {
        user_access: this.userRole,
        history_event_type: eventType,
      },
    );
  }
}
