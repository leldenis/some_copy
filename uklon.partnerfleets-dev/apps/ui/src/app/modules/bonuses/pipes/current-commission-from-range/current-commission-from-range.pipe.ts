import { Pipe, PipeTransform } from '@angular/core';
import { CommissionRateDto } from '@data-access';

@Pipe({
  name: 'currentCommissionFromRange',
  standalone: true,
})
export class CurrentCommissionFromRangePipe implements PipeTransform {
  public transform(currentCompletedOrders: number, commissions: CommissionRateDto[]): number {
    const currentCommission = commissions.find(
      (commission) =>
        currentCompletedOrders >= commission.order_completed_count_range.from &&
        currentCompletedOrders <= commission.order_completed_count_range.to,
    );

    return currentCommission ? currentCommission.value * 100 : 0;
  }
}
