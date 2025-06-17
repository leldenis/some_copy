import { Pipe, PipeTransform } from '@angular/core';
import { CommissionRateDto } from '@data-access';

@Pipe({
  name: 'sortCommissions',
  standalone: true,
})
export class SortCommissionsPipe implements PipeTransform {
  public transform(commissions: CommissionRateDto[]): CommissionRateDto[] {
    return [...commissions].sort((a, b) => a.order_completed_count_range.from - b.order_completed_count_range.from);
  }
}
