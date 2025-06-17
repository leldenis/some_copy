import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import {
  AnalyticsUserRole,
  DashboardStatisticsDto,
  DateRangeDto,
  FleetAnalyticsEventType,
  getCurrentWeek,
} from '@data-access';
import { TranslateModule } from '@ngx-translate/core';
import { AnalyticsService } from '@ui/core/services/analytics.service';
import { LoadingIndicatorService } from '@ui/core/services/loading-indicator.service';
import { StorageFiltersKey, StorageService, fleetIdKey, userRoleKey } from '@ui/core/services/storage.service';
import { BasicStatisticsComponent } from '@ui/modules/general/components/basic-statistics/basic-statistics.component';
import { IncomeStatisticsComponent } from '@ui/modules/general/components/income-statistics/income-statistics.component';
import { ProductTypeStatisticsComponent } from '@ui/modules/general/components/product-type-statistics/product-type-statistics.component';
import { TopDriversComponent } from '@ui/modules/general/components/top-drivers/top-drivers.component';
import { DateTimeRangeControlComponent, UIService } from '@ui/shared';
import { FiltersContainerComponent } from '@ui/shared/components/filters-container/filters-container.component';
import {
  BehaviorSubject,
  Observable,
  combineLatest,
  filter,
  finalize,
  interval,
  shareReplay,
  startWith,
  switchMap,
  tap,
} from 'rxjs';

import { toServerDate } from '@uklon/angular-core';

import { StatisticsService } from '../../services/statistics.service';

const UPDATE_INTERVAL = 900_000; // 15 minutes

@Component({
  selector: 'upf-general',
  standalone: true,
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FiltersContainerComponent,
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    BasicStatisticsComponent,
    IncomeStatisticsComponent,
    ProductTypeStatisticsComponent,
    TopDriversComponent,
    TranslateModule,
    AsyncPipe,
    DateTimeRangeControlComponent,
  ],
})
export class GeneralComponent implements OnDestroy {
  public readonly filterKey = StorageFiltersKey.DASHBOARD;
  public readonly filtersForm = new FormGroup({
    dateRange: new FormControl<DateRangeDto>(getCurrentWeek()),
  });

  public readonly range$ = new BehaviorSubject<DateRangeDto>(null);
  public readonly interval$ = interval(UPDATE_INTERVAL).pipe(startWith(0));
  public readonly stats$ = combineLatest([this.range$.pipe(filter(Boolean)), this.interval$]).pipe(
    takeUntilDestroyed(),
    tap(() => this.loaderService.show()),
    switchMap(([dateRange]) => this.getStatistics(dateRange)),
    shareReplay(1),
  );

  constructor(
    private readonly storage: StorageService,
    private readonly analytics: AnalyticsService,
    private readonly statistics: StatisticsService,
    private readonly loaderService: LoadingIndicatorService,
    private readonly uiService: UIService,
  ) {
    this.setShellConfig();
    this.analytics.reportEvent<AnalyticsUserRole>(FleetAnalyticsEventType.DASHBOARD_SCREEN, {
      user_access: this.storage.get(userRoleKey) || '',
    });
  }

  public ngOnDestroy(): void {
    this.uiService.resetConfig();
  }

  private getStatistics({ from, to }: DateRangeDto): Observable<DashboardStatisticsDto> {
    return this.statistics
      .getDashboardStatistics(
        this.storage.get(fleetIdKey) || '',
        toServerDate(new Date(from)),
        toServerDate(new Date(to)),
      )
      .pipe(finalize(() => this.loaderService.hide()));
  }

  private setShellConfig(): void {
    this.uiService.setConfig({
      header: {
        title: true,
        backNavigationButton: false,
        subtitle: 'Dashboard.Statistics.Subtitle',
      },
    });
  }
}
