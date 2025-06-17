import { CommonModule, TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, input, OnDestroy, OnInit } from '@angular/core';
import { DashboardStatisticsHistogramItemDto, DateRangeDto } from '@data-access';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { EmptyStateComponent } from '@ui/shared/components/empty-state/empty-state.component';
import { EmptyStates } from '@ui/shared/components/empty-state/empty-states';
import { DATE_PERIODS } from '@ui/shared/consts';
import { PeriodLabel } from '@ui/shared/enums';
import { MoneyPipe } from '@ui/shared/pipes/money';
import { ChartConfiguration, ChartData, ScriptableScaleContext, TooltipItem } from 'chart.js';
import moment from 'moment';
import { NgChartsModule } from 'ng2-charts';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';

import { Currency } from '@uklon/types';

import { INCOME_COLORS_MAP, QUARTERS } from '../../consts/chart-data.const';
import { chartLabelsConfig, tooltipLabel, tooltipLine, xScaleHighlight } from '../../plugins/chart-plugins';

const LABEL_WIDTH_PX = 50;
const EMPTY_STATS: ChartData<'bar' | 'line'> = { datasets: [] };

@Component({
  selector: 'upf-income-statistics',
  standalone: true,
  imports: [CommonModule, NgChartsModule, TranslateModule, EmptyStateComponent],
  providers: [MoneyPipe, TitleCasePipe],
  templateUrl: './income-statistics.component.html',
  styleUrls: ['./income-statistics.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IncomeStatisticsComponent implements OnInit, OnDestroy {
  public readonly stats = input.required<DashboardStatisticsHistogramItemDto[]>();
  public readonly range = input.required<DateRangeDto>();

  public data$ = new BehaviorSubject<ChartData<'bar' | 'line'>>(EMPTY_STATS);
  public statistics: DashboardStatisticsHistogramItemDto[] = [];
  public currency = Currency.UAH;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public options: ChartConfiguration<any>['options'];
  public rangeLabel: string;
  public format: string | string[] = 'dd D.MM';
  public type: 'bar' | 'line' = 'bar';
  public plugins = [tooltipLine(), xScaleHighlight()];
  public minWidth: number;
  public readonly dataColors = INCOME_COLORS_MAP;
  public readonly width: number;
  public readonly height: number;
  public readonly emptyState = EmptyStates;

  private statsRange: DateRangeDto;
  private chartType: 'bar' | 'line' = 'bar';
  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly moneyPipe: MoneyPipe,
    private readonly translateService: TranslateService,
    private readonly titleCasePipe: TitleCasePipe,
  ) {
    effect(() => {
      this.statsRange = this.range();
      this.initStatisticsData(this.stats());
      this.handleRange(this.range());
    });
  }

  public get currentLanguage(): string {
    return this.translateService.currentLang;
  }

  public ngOnInit(): void {
    this.translateService.onLangChange.pipe(takeUntil(this.destroy$)).subscribe(({ lang }) => {
      this.handleRange(this.statsRange);
      if (this.statistics.length === 0) return;
      this.setChartData(this.statistics, lang);
    });
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initStatisticsData(statistics: DashboardStatisticsHistogramItemDto[]): void {
    if (!statistics?.length) {
      this.data$.next(EMPTY_STATS);
      this.statistics = [];
      return;
    }

    this.statistics = statistics;
    this.minWidth = statistics.length * LABEL_WIDTH_PX;
    this.initChart(statistics);
  }

  private initChart(stats: DashboardStatisticsHistogramItemDto[]): void {
    this.setChartOptions();
    this.setChartData(stats);
  }

  private setChartData(stats: DashboardStatisticsHistogramItemDto[], locale: string = this.currentLanguage): void {
    this.data$.next({
      labels: stats.map(({ date }) => {
        if (!Array.isArray(this.format)) {
          return this.titleCasePipe.transform(
            moment(date * 1000)
              .locale(locale)
              .format(this.format),
          );
        }
        return [
          this.titleCasePipe.transform(
            moment(date * 1000)
              .locale(locale)
              .format(this.format[0]),
          ),
          moment(date * 1000)
            .locale(locale)
            .format(this.format[1]),
        ];
      }),
      datasets: Object.keys(INCOME_COLORS_MAP).map((key) => ({
        data: stats.map((item) => item[key as keyof Omit<DashboardStatisticsHistogramItemDto, 'date'>].amount / 100),
        backgroundColor: INCOME_COLORS_MAP[key],
        borderColor: INCOME_COLORS_MAP[key],
        pointBackgroundColor: INCOME_COLORS_MAP[key],
      })),
    });

    this.type = this.chartType;
  }

  private setChartOptions(): void {
    this.options = {
      responsive: true,
      borderRadius: 5,
      barPercentage: 0.7,
      tension: 0.4,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          displayColors: true,
          usePointStyle: true,
          boxWidth: 8,
          boxHeight: 8,
          bodySpacing: 8,
          padding: 8,
          filter: (tooltip: TooltipItem<'line' | 'bar'>) => {
            return !!tooltip.raw;
          },
          callbacks: {
            labelPointStyle: () => ({
              pointStyle: 'circle',
            }),
            label: (tooltip: TooltipItem<'line' | 'bar'>) => {
              return this.createTooltipLabel(tooltip);
            },
            title: (tooltip: TooltipItem<'line' | 'bar'>[]) => {
              const { date } = this.statistics[tooltip[0].dataIndex];
              return this.titleCasePipe.transform(tooltipLabel(date, this.format, this.currentLanguage));
            },
          },
        },
      },
      interaction: {
        intersect: false,
        mode: 'index',
      },
      scales: {
        x: {
          stacked: this.chartType === 'bar',
          grid: {
            display: false,
            drawBorder: false,
          },
        },
        y: {
          stacked: this.chartType === 'bar',
          grid: {
            borderDash: (ctx: ScriptableScaleContext) => {
              return ctx.tick.value === 0 ? [10, 0] : [10, 10];
            },
            drawBorder: false,
            drawTicks: false,
            color: (ctx: ScriptableScaleContext) => {
              return ctx.tick.value < 0 ? '#E97171' : '#E0E0E0';
            },
          },
          ticks: {
            padding: 10,
            callback: (value: number) => {
              return this.moneyPipe.transform(value, this.currency);
            },
            color: (ctx: ScriptableScaleContext) => {
              return ctx.tick.value < 0 ? '#E97171' : '#73757E';
            },
          },
        },
      },
    };
  }

  private createTooltipLabel(tooltip: TooltipItem<'line' | 'bar'>): string {
    const type = this.translateService.instant(
      `Dashboard.Statistics.IncomeType.${Object.keys(INCOME_COLORS_MAP)[tooltip.datasetIndex]}`,
    );
    const money = this.moneyPipe.transform(tooltip.raw, this.currency);
    return `  ${type} - ${money}`;
  }

  private handleRange({ from, to }: DateRangeDto): void {
    const label = DATE_PERIODS.find(({ values }) => values.from === from && values.to === to)?.label as PeriodLabel;
    const quarter = QUARTERS[moment(from).quarter()];
    const { chartType, labelFormat, rangeLabel } = chartLabelsConfig(label, from, to, this.currentLanguage);

    this.chartType = chartType;
    this.format = labelFormat;
    this.rangeLabel =
      label === PeriodLabel.LAST_QUARTER || label === PeriodLabel.CURRENT_QUARTER
        ? this.translateService.instant(rangeLabel, { quarter })
        : this.translateService.instant(rangeLabel).toLowerCase();
  }
}
