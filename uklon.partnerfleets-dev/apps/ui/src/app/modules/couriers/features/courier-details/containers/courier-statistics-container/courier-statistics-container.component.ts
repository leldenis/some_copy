import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatDivider } from '@angular/material/divider';
import { FleetEmployeeType } from '@constant';
import { DateRangeDto, StatisticDetailsDto, StatisticsProfitKeysType } from '@data-access';
import { TranslateService } from '@ngx-translate/core';
import { StorageFiltersKey } from '@ui/core/services/storage.service';
import { CouriersService } from '@ui/modules/couriers/services/couriers.service';
import { EmptyStateComponent } from '@ui/shared/components/empty-state/empty-state.component';
import { EmptyStates } from '@ui/shared/components/empty-state/empty-states';
import {
  StatisticDetailsComponent,
  StatisticEarningsForPeriodComponent,
  StatisticEmployeeInfoComponent,
  StatisticFiltersComponent,
} from '@ui/shared/components/statistics';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { filter, map, startWith, switchMap } from 'rxjs/operators';

@Component({
  selector: 'upf-courier-statistics-container',
  standalone: true,
  imports: [
    StatisticFiltersComponent,
    AsyncPipe,
    StatisticEarningsForPeriodComponent,
    MatDivider,
    StatisticEmployeeInfoComponent,
    StatisticDetailsComponent,
    EmptyStateComponent,
  ],
  templateUrl: './courier-statistics-container.component.html',
  styleUrls: ['./courier-statistics-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CourierStatisticsContainerComponent {
  @Input() public fleetId: string;
  @Input() public courierId: string;

  public readonly fleetEmployeeType = FleetEmployeeType;
  public readonly emptyState = EmptyStates;
  public readonly filterKey = StorageFiltersKey.COURIER_STATISTIC;
  public readonly filtersChange$ = new BehaviorSubject<DateRangeDto>(null);

  public chartLabels$: Observable<Record<StatisticsProfitKeysType, string>> = this.translateService.onLangChange.pipe(
    startWith(() => this.translateService.currentLang),
    map(() => ({
      cash: this.translateService.instant('DriverStatistic.PieChart.DriverOrderProfit.Cash.Label'),
      card: this.translateService.instant('DriverStatistic.PieChart.DriverOrderProfit.Card.Label'),
      wallet: this.translateService.instant('DriverStatistic.PieChart.DriverOrderProfit.Wallet.Label'),
    })),
  );
  public statistic$: Observable<StatisticDetailsDto> = combineLatest([this.filtersChange$.pipe(filter(Boolean))]).pipe(
    switchMap(([{ from, to }]) => {
      const filters = { date_from: from, date_to: to };
      return this.courierService.getFleetCourierStatistics(this.fleetId, this.courierId, filters);
    }),
  );

  constructor(
    private readonly courierService: CouriersService,
    private readonly translateService: TranslateService,
  ) {}
}
