import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { CurrencyPipe, PercentPipe, TitleCasePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DEFAULT_CURRENCY_CODE,
  ElementRef,
  Inject,
  input,
  LOCALE_ID,
  signal,
} from '@angular/core';
import { StatisticOrderProfitDto, MoneyDto, StatisticsProfitKeysType } from '@data-access';
import { TranslateModule } from '@ngx-translate/core';
import { MoneyPipe } from '@ui/shared/pipes/money';
import { ChartConfiguration, ChartData } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';

interface DataSetData {
  chartLabels: string[][];
  chartColors: string[];
  chartData: number[];
}

@Component({
  selector: 'upf-statistic-pie-chart',
  standalone: true,
  imports: [NgChartsModule, TranslateModule],
  providers: [PercentPipe, CurrencyPipe, MoneyPipe, TitleCasePipe],
  templateUrl: './statistic-pie-chart.component.html',
  styleUrls: ['./statistic-pie-chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatisticPieChartComponent {
  public readonly colors = input<Record<StatisticsProfitKeysType, string>>({});
  public readonly labels = input<Record<StatisticsProfitKeysType, string>>({});
  public readonly profit = input<StatisticOrderProfitDto>(null);

  public readonly options = signal<ChartConfiguration<'doughnut'>['options']>({});
  public readonly data = computed<ChartData<'doughnut'>>(() => this.getChartData());
  public readonly width: number;
  public readonly height: number;

  private readonly moneyPipe = new MoneyPipe(this.defaultCurrencyCode, this.localeId);

  constructor(
    @Inject(LOCALE_ID) private readonly localeId: string,
    @Inject(DEFAULT_CURRENCY_CODE) private readonly defaultCurrencyCode: string,
    private readonly elementRef: ElementRef,
    private readonly percentPipe: PercentPipe,
  ) {
    this.setChartConfigurationOptions();
    const hostElement = this.elementRef.nativeElement as HTMLElement;
    const { height, width } = hostElement.getBoundingClientRect();
    this.width = width;
    this.height = height;
  }

  private setChartConfigurationOptions(): void {
    this.options.set({
      responsive: true,
      plugins: {
        tooltip: {
          displayColors: false,
          filter: (item) => {
            // eslint-disable-next-line no-param-reassign
            item.formattedValue = '';
            return true;
          },
        },
        legend: {
          display: false,
        },
      },
    });
  }

  private createMoneyLabel(money: MoneyDto): string {
    return this.moneyPipe.transform(money.amount / 100, money.currency);
  }

  private createPercentLabel(money: MoneyDto): string | null {
    const hasTotalAmount = coerceBooleanProperty(this.profit().total) && this.profit().total?.amount > 0;

    if (!hasTotalAmount) {
      return null;
    }

    const coefficient = money.amount / this.profit().total.amount;
    return this.percentPipe.transform(coefficient, '1.2-2');
  }

  private getChartLabels(label: string, money: MoneyDto): string[] {
    const moneyLabel = this.createMoneyLabel(money);
    const labels = [label, moneyLabel];
    const percentLabel = this.createPercentLabel(money);

    if (percentLabel) {
      labels.push(percentLabel);
    }

    return labels;
  }

  private getChartData(excludeProfitKey: keyof StatisticOrderProfitDto = 'total'): ChartData<'doughnut'> {
    const data = this.profit() ? this.getDataSetData(excludeProfitKey) : ({} as DataSetData);

    return {
      labels: data?.chartLabels ?? [],
      datasets: [
        {
          data: data?.chartData ?? [],
          backgroundColor: data?.chartColors ?? [],
          hoverBackgroundColor: data?.chartColors ?? [],
          hoverBorderWidth: 0,
          hoverOffset: 0,
          borderWidth: 0,
          borderRadius: 0,
          borderColor: 'white',
          hoverBorderColor: 'white',
        },
      ],
    };
  }

  private getDataSetData(excludeProfitKey: keyof StatisticOrderProfitDto): DataSetData {
    const labels = this.labels() ?? {};
    const data: { label: string[]; color: string; amount: number }[] = [];

    Object.entries(this.profit() ?? {}).forEach(([profitTypeKey, moneyValue]) => {
      if (profitTypeKey !== excludeProfitKey) {
        const label = this.getChartLabels(labels[profitTypeKey], moneyValue);
        const color = this.colors()[profitTypeKey];
        const { amount } = moneyValue;

        data.push({ label, color, amount });
      }
    });
    data.sort((a, b) => b.amount - a.amount);

    return {
      chartLabels: data.map(({ label }) => label),
      chartColors: data.map(({ color }) => color),
      chartData: data.map(({ amount }) => amount),
    };
  }
}
