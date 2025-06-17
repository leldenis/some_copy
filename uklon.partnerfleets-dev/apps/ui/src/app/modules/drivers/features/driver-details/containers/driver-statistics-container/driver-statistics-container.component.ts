import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatDivider } from '@angular/material/divider';
import { DateRangeDto, StatisticsProfitKeysType, StatisticDetailsDto } from '@data-access';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { DriverService } from '@ui/core';
import { StorageFiltersKey } from '@ui/core/services/storage.service';
import { EmptyStateComponent } from '@ui/shared/components/empty-state/empty-state.component';
import { EmptyStates } from '@ui/shared/components/empty-state/empty-states';
import {
  StatisticEmployeeInfoComponent,
  StatisticDetailsComponent,
  StatisticEarningsForPeriodComponent,
  StatisticFiltersComponent,
} from '@ui/shared/components/statistics';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { filter, map, startWith, switchMap } from 'rxjs/operators';

@Component({
  selector: 'upf-driver-statistics-container',
  standalone: true,
  imports: [
    CommonModule,
    StatisticFiltersComponent,
    StatisticEmployeeInfoComponent,
    StatisticEarningsForPeriodComponent,
    StatisticDetailsComponent,
    TranslateModule,
    MatDivider,
    EmptyStateComponent,
  ],
  templateUrl: './driver-statistics-container.component.html',
  styleUrls: ['./driver-statistics-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DriverStatisticsContainerComponent {
  public readonly driverId = input.required<string>();
  public readonly fleetId = input.required<string>();

  public readonly emptyState = EmptyStates;
  public readonly filterKey = StorageFiltersKey.DRIVER_STATISTICS;
  public readonly filtersChange$ = new BehaviorSubject<DateRangeDto>(null);

  public chartLabels$: Observable<Record<StatisticsProfitKeysType, string>> = this.translateService.onLangChange.pipe(
    startWith(() => this.translateService.currentLang),
    map(() => ({
      cash: this.translateService.instant('DriverStatistic.PieChart.DriverOrderProfit.Cash.Label'),
      card: this.translateService.instant('DriverStatistic.PieChart.DriverOrderProfit.Card.Label'),
      wallet: this.translateService.instant('DriverStatistic.PieChart.DriverOrderProfit.Wallet.Label'),
      merchant: this.translateService.instant('Orders.Trips.List.Merchant'),
    })),
  );
  public statistic$: Observable<StatisticDetailsDto> = combineLatest([this.filtersChange$.pipe(filter(Boolean))]).pipe(
    switchMap(([{ from, to }]) => {
      const filters = { date_from: from, date_to: to };
      return this.driverService.getFleetDriverStatistics(this.fleetId(), this.driverId(), filters);
    }),
  );

  constructor(
    private readonly driverService: DriverService,
    private readonly translateService: TranslateService,
  ) {}
}
