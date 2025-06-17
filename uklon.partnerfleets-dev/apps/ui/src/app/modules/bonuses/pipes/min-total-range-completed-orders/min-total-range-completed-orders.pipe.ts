import { Pipe, PipeTransform } from '@angular/core';
import { CommissionRateDto } from '@data-access';

@Pipe({
  name: 'minTotalRangeCompletedOrders',
  standalone: true,
})
export class MinTotalRangeCompletedOrdersPipe implements PipeTransform {
  public transform(commissions: CommissionRateDto[]): number {
    if (commissions.length === 1) {
      return commissions[0].order_completed_count_range.to;
    }

    const commissionsSorted = commissions.sort((a, b) => a.value - b.value);
    return commissionsSorted.length > 0 ? commissionsSorted[0].order_completed_count_range.from : 0;
  }
}
