import { Pipe, PipeTransform } from '@angular/core';
import { CommissionRateDto } from '@data-access';

@Pipe({
  name: 'minCommission',
  standalone: true,
})
export class MinCommissionPipe implements PipeTransform {
  public transform(commissions: CommissionRateDto[]): number {
    const commissionsSorted = commissions.sort((a, b) => a.value - b.value);
    return commissionsSorted.length > 0 ? commissions[0].value * 100 : 0;
  }
}
