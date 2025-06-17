import { KeyValuePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatLabel } from '@angular/material/form-field';
import { MatFormField, MatOption, MatSelect, MatSelectChange } from '@angular/material/select';
import {
  AnalyticsHistoryEventType,
  AnalyticsUserRole,
  FleetAnalyticsEventType,
  FleetHistoryFiltersDto,
  FleetHistoryType,
} from '@data-access';
import { TranslateModule } from '@ngx-translate/core';
import { AnalyticsService } from '@ui/core/services/analytics.service';
import { StorageFiltersKey, StorageService, userRoleKey } from '@ui/core/services/storage.service';
import { FiltersContainerComponent } from '@ui/shared/components/filters-container/filters-container.component';

@Component({
  selector: 'upf-fleet-history-filters',
  standalone: true,
  templateUrl: './fleet-history-filters.component.html',
  styleUrls: ['./fleet-history-filters.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FiltersContainerComponent,
    ReactiveFormsModule,
    MatFormField,
    TranslateModule,
    MatSelect,
    MatLabel,
    MatOption,
    KeyValuePipe,
  ],
})
export class FleetHistoryFiltersComponent {
  public readonly filtersChange = output<FleetHistoryFiltersDto>();

  public readonly filterKey = StorageFiltersKey.FLEET_HISTORY;
  public readonly historyType = FleetHistoryType;
  public readonly filtersForm = new FormGroup({
    changeType: new FormControl<FleetHistoryType | ''>(''),
  });

  constructor(
    private readonly analytics: AnalyticsService,
    private readonly storage: StorageService,
  ) {}

  private get userRole(): string {
    return this.storage.get(userRoleKey);
  }

  public reportEvent(): void {
    this.analytics.reportEvent<AnalyticsUserRole>(FleetAnalyticsEventType.FLEET_PROFILE_EVENT_TYPE_FILTER_OPENED, {
      user_access: this.userRole,
    });
  }

  public onSelectionChange({ value }: MatSelectChange): void {
    this.analytics.reportEvent<AnalyticsHistoryEventType>(
      FleetAnalyticsEventType.FLEET_PROFILE_HISTORY_EVENT_TYPE_SELECTED,
      {
        user_access: this.userRole,
        history_event_type: value,
      },
    );
  }
}
