import { ChangeDetectionStrategy, Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import {
  AnalyticsDateRangeType,
  AnalyticsUserRole,
  DateRangeDto,
  FleetAnalyticsEventType,
  getCurrentWeek,
} from '@data-access';
import { TranslateModule } from '@ngx-translate/core';
import { AnalyticsService } from '@ui/core/services/analytics.service';
import { StorageFiltersKey, StorageService, userRoleKey } from '@ui/core/services/storage.service';
import {
  DateTimeRangeControlComponent,
  DriversAutocompleteComponent,
  NotificationsQueryParamsDirective,
} from '@ui/shared';
import { FiltersContainerComponent } from '@ui/shared/components/filters-container/filters-container.component';
import { DATE_PERIODS } from '@ui/shared/consts';

import { DriversFeedbackFiltersDto } from '../../models/feedback.dto';

@Component({
  selector: 'upf-feedback-filters',
  standalone: true,
  imports: [
    FiltersContainerComponent,
    ReactiveFormsModule,
    NotificationsQueryParamsDirective,
    TranslateModule,
    MatFormField,
    MatLabel,
    DriversAutocompleteComponent,
    DateTimeRangeControlComponent,
  ],
  templateUrl: './feedback-filters.component.html',
  styleUrls: ['./feedback-filters.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeedbackFiltersComponent implements OnInit {
  @Input() public isMobileView: boolean;
  @Input() public fleetId: string;

  @Output() public filtersChange = new EventEmitter<DriversFeedbackFiltersDto>();

  public readonly analyticsType = FleetAnalyticsEventType;
  public readonly filterKey = StorageFiltersKey.FEEDBACKS;
  public filterGroup = new FormGroup({
    period: new FormControl<DateRangeDto>(getCurrentWeek()),
    driverId: new FormControl<string>(''),
  });

  private readonly analytics = inject(AnalyticsService);
  private readonly storage = inject(StorageService);

  private get userRole(): string {
    return this.storage.get(userRoleKey) || '';
  }

  public ngOnInit(): void {
    this.reportEvent(FleetAnalyticsEventType.FEEDBACKS_SCREEN);
  }

  public reportEvent(eventType: FleetAnalyticsEventType): void {
    this.analytics.reportEvent<AnalyticsUserRole>(eventType, { user_access: this.userRole });
  }

  public reportRangeChange({ from, to }: DateRangeDto): void {
    const period = DATE_PERIODS.find(({ values }) => from === values.from && to === values.to);
    const customProps: AnalyticsDateRangeType = period
      ? { period_type: period.analyticsLabel }
      : { period_type: 'Custom', start_date: from, end_date: to };

    this.analytics.reportEvent<AnalyticsDateRangeType>(FleetAnalyticsEventType.FEEDBACKS_PERIOD_FILTER, {
      user_access: this.userRole,
      ...customProps,
    });
  }
}
