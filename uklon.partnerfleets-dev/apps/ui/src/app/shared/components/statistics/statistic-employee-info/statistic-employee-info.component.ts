import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { StatisticDetailsDto } from '@data-access';
import { TranslateModule } from '@ngx-translate/core';
import { MetersToDistancePipe } from '@ui/modules/drivers/pipes';
import { DurationPipe } from '@ui/shared';
import { MoneyPipe } from '@ui/shared/pipes/money';

import { Currency } from '@uklon/types';

@Component({
  selector: 'upf-statistic-employee-info',
  standalone: true,
  imports: [CommonModule, MatIconModule, MetersToDistancePipe, TranslateModule, DurationPipe, MoneyPipe],
  templateUrl: './statistic-employee-info.component.html',
  styleUrls: ['./statistic-employee-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatisticEmployeeInfoComponent {
  public readonly titleKey = input.required<string>();
  public readonly statistic = input.required<StatisticDetailsDto>();
  public readonly currency = computed(() => this.statistic().average_price_per_kilometer?.currency || Currency.UAH);
}
