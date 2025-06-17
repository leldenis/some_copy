import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, effect, ElementRef, input, viewChild } from '@angular/core';
import { DashboardStatisticsProductItemDto } from '@data-access';
import { TranslateModule } from '@ngx-translate/core';
import { NormalizeStringPipe } from '@ui/shared';
import { EmptyStateComponent } from '@ui/shared/components/empty-state/empty-state.component';
import { EmptyStates } from '@ui/shared/components/empty-state/empty-states';
import { LetDirective } from '@ui/shared/directives/let.directive';
import { MoneyPipe } from '@ui/shared/pipes/money';
import { ChartConfiguration, ChartData } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';
import { BehaviorSubject, fromEvent, map, Observable, startWith } from 'rxjs';

import { Currency } from '@uklon/types';

import { PRODUCTS_COLORS_MAP } from '../../consts/chart-data.const';

const EMPTY_STATS: ChartData<'doughnut'> = { datasets: [] };
const SCROLL_ANIMATION_DISTANCE_PX = 30;

@Component({
  selector: 'upf-product-type-statistics',
  standalone: true,
  imports: [
    CommonModule,
    NgChartsModule,
    TranslateModule,
    LetDirective,
    NormalizeStringPipe,
    MoneyPipe,
    EmptyStateComponent,
  ],
  templateUrl: './product-type-statistics.component.html',
  styleUrls: ['./product-type-statistics.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductTypeStatisticsComponent implements AfterViewInit {
  public readonly scroller = viewChild<ElementRef<HTMLElement>>('scroller');
  public readonly bgColor = input<string>('white');
  public readonly stats = input.required<DashboardStatisticsProductItemDto[]>();

  public data$ = new BehaviorSubject<ChartData<'doughnut'>>(EMPTY_STATS);
  public statistics: DashboardStatisticsProductItemDto[] = [];
  public options: ChartConfiguration<'doughnut'>['options'];
  public total = 0;
  public currency = Currency.UAH;
  public chartScrolled$: Observable<boolean>;
  public readonly emptyState = EmptyStates;
  public readonly colors = PRODUCTS_COLORS_MAP;

  constructor() {
    effect(() => this.initStatisticsData(this.stats()));
  }

  public ngAfterViewInit(): void {
    this.initScrollListener();
  }

  private initStatisticsData(statistics: DashboardStatisticsProductItemDto[]): void {
    if (!statistics?.length) {
      this.data$.next(EMPTY_STATS);
      this.statistics = [];
      return;
    }

    this.statistics = statistics.sort((a, b) => b.percent - a.percent);
    this.initChart(this.statistics);
  }

  private initChart(stats: DashboardStatisticsProductItemDto[]): void {
    this.setChartOptions();
    this.setChartData(stats);

    this.total = stats.reduce((acc, { earnings }) => {
      this.currency = earnings.currency;
      return acc + earnings.amount;
    }, 0);
  }

  private setChartOptions(): void {
    this.options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          displayColors: false,
          enabled: false,
        },
      },
      elements: {
        arc: {
          borderWidth: 15,
          borderColor: this.bgColor(),
          hoverBorderColor: this.bgColor(),
        },
      },
      cutout: '65%',
    };
  }

  private setChartData(stats: DashboardStatisticsProductItemDto[]): void {
    this.data$.next({
      labels: [],
      datasets: [
        {
          data: stats.map(({ earnings }) => earnings.amount / 100),
          backgroundColor: stats.map(({ product_code }) => this.colors[product_code.toLowerCase()]),
          borderRadius: 20,
        },
      ],
    });
  }

  private initScrollListener(): void {
    this.chartScrolled$ = fromEvent(this.scroller().nativeElement, 'scroll').pipe(
      map((event: Event) => {
        const scrollDistance = (event.target as HTMLElement).scrollTop;
        return scrollDistance > SCROLL_ANIMATION_DISTANCE_PX;
      }),
      startWith(false),
    );
  }
}
