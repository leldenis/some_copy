import { Pipe, PipeTransform } from '@angular/core';
import { BrandingBonusCalcSourceDto, BrandingBonusSpecOldDto } from '@data-access';

@Pipe({
  name: 'ordersCompletedOld',
  standalone: true,
})
export class OrdersCompletedOldPipe implements PipeTransform {
  public transform(calculation_source: BrandingBonusCalcSourceDto, specification: BrandingBonusSpecOldDto): string {
    const completed = calculation_source.orders.completed || 0;
    const specOrdersCompletedCount = specification?.orders?.completed?.count;
    const total =
      specOrdersCompletedCount?.length > 0
        ? specOrdersCompletedCount[specOrdersCompletedCount.length - 1]?.range?.[0]
        : 0;

    return `${completed}/${total}`;
  }
}
