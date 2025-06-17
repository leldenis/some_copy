import { Pipe, PipeTransform } from '@angular/core';
import { CommissionRateDto } from '@data-access';

@Pipe({
  name: 'totalOfCurrentRange',
  standalone: true,
})
export class TotalOfCurrentRangePipe implements PipeTransform {
  public transform(completedOrders: number, commissions: CommissionRateDto[]): number {
    const currentRange = commissions.find((commission) => {
      return (
        completedOrders >= commission.order_completed_count_range.from &&
        completedOrders <= commission.order_completed_count_range.to
      );
    });

    return currentRange?.order_completed_count_range?.to || 0;
  }
}
