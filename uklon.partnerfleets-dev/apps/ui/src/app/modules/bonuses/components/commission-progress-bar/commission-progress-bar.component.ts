import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommissionRateDto } from '@data-access';
import { MinTotalRangeCompletedOrdersPipe } from '@ui/modules/bonuses/pipes/min-total-range-completed-orders/min-total-range-completed-orders.pipe';
import { TotalOfCurrentRangePipe } from '@ui/modules/bonuses/pipes/total-of-current-range/total-of-current-range.pipe';
import { ProgressBarComponent, ProgressBarValuePipe } from '@ui/shared';

@Component({
  selector: 'upf-commission-progress-bar',
  standalone: true,
  imports: [TotalOfCurrentRangePipe, ProgressBarComponent, ProgressBarValuePipe, MinTotalRangeCompletedOrdersPipe],
  templateUrl: './commission-progress-bar.component.html',
  styleUrl: './commission-progress-bar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommissionProgressBarComponent {
  @Input() public byCurrentRange = false;
  @Input() public completedOrders: number;
  @Input() public commissions: CommissionRateDto[];
  @Input() public theme: 'green' | 'black' = 'green';
  @Input() public size: 'sm' | 'md' = 'sm';
  @Input() public inactive = false;
}
