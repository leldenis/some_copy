import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { StatisticDetailsDto } from '@data-access';
import { TranslateModule } from '@ngx-translate/core';
import { MoneyPipe } from '@ui/shared/pipes/money';

@Component({
  selector: 'upf-statistic-earnings-for-period',
  standalone: true,
  imports: [CommonModule, TranslateModule, MoneyPipe],
  templateUrl: './statistic-earnings-for-period.component.html',
  styleUrls: ['./statistic-earnings-for-period.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatisticEarningsForPeriodComponent {
  @Input() public statistic: StatisticDetailsDto;
}
