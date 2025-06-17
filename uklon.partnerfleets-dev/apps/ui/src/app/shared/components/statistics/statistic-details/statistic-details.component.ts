import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { StatisticDetailsDto, StatisticsProfitKeysType } from '@data-access';
import { TranslateModule } from '@ngx-translate/core';
import { CommissionPipe } from '@ui/shared';
import { SplitPaymentsTooltipComponent } from '@ui/shared/components/split-payments-tooltip/split-payments-tooltip.component';
import { StatisticPieChartComponent } from '@ui/shared/components/statistics/statistic-pie-chart/statistic-pie-chart.component';
import { LetDirective } from '@ui/shared/directives/let.directive';
import { MoneyPipe } from '@ui/shared/pipes/money';

@Component({
  selector: 'upf-statistic-details',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    StatisticPieChartComponent,
    MatDividerModule,
    MatIconModule,
    SplitPaymentsTooltipComponent,
    LetDirective,
    CommissionPipe,
    MoneyPipe,
  ],
  providers: [MoneyPipe],
  templateUrl: './statistic-details.component.html',
  styleUrls: ['./statistic-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatisticDetailsComponent {
  public readonly statistic = input.required<StatisticDetailsDto>();
  public readonly chartLabels = input<Record<StatisticsProfitKeysType, string>>({});
  public readonly isCourier = input<boolean>();
  public readonly hasCommissionProgram = computed(
    () => this.statistic()?.profit?.commission_programs_profit?.amount > 0,
  );

  public readonly minPercent = 0.01;
  public readonly orderProfitColorMap: Record<StatisticsProfitKeysType, string> = {
    cash: '#33CCA1',
    card: '#F2AD5C',
    wallet: '#3D81D2',
    merchant: '#00783E',
  };
}
