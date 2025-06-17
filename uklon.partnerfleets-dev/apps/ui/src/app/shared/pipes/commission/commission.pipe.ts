import { Pipe, PipeTransform } from '@angular/core';
import { MoneyDto } from '@data-access';

@Pipe({
  name: 'upfCommission',
  standalone: true,
})
export class CommissionPipe implements PipeTransform {
  public transform(loss: MoneyDto | undefined, profit: MoneyDto | undefined): { total: MoneyDto; profit: MoneyDto } {
    if (!loss || !profit) return null;

    return {
      total: { ...loss, amount: loss.amount - profit.amount },
      profit: { ...loss, amount: loss.amount },
    };
  }
}
