import { Pipe, PipeTransform } from '@angular/core';
import { CommissionRateDto } from '@data-access';

@Pipe({
  name: 'minOrdersForMinCommission',
  standalone: true,
})
export class MinOrdersForMinCommissionPipe implements PipeTransform {
  public transform(commissions: CommissionRateDto[]): number {
    const commissionsSorted = commissions.sort((a, b) => a.value - b.value);
    return commissionsSorted.length > 0 ? commissions[0].order_completed_count_range.from : 0;
  }
}
