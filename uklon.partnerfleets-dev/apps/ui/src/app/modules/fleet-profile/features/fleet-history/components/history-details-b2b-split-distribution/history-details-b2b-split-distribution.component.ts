import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { DotMarkerIconComponent } from '@ui/shared';
import { MoneyPipe } from '@ui/shared/pipes/money';

interface B2BSplitDistributionBalance {
  amount_cent: number;
  uklon_percentage: number;
  partner_percentage: number;
}

@Component({
  selector: 'upf-history-details-b2b-split-distribution',
  standalone: true,
  imports: [CommonModule, DotMarkerIconComponent, TranslateModule, MoneyPipe],
  templateUrl: './history-details-b2b-split-distribution.component.html',
  styleUrl: './history-details-b2b-split-distribution.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HistoryDetailsB2bSplitDistributionComponent {
  public readonly balanceGreater = input<boolean>(true);
  public readonly balance = input<B2BSplitDistributionBalance>();
}
