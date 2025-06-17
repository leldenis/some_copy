import { Pipe, PipeTransform } from '@angular/core';
import { BrandingBonusCalcSourceDto, BrandingCalculationProgramParamsDto } from '@data-access';

@Pipe({
  name: 'ordersCompleted',
  standalone: true,
})
export class OrdersCompletedPipe implements PipeTransform {
  public transform(
    calculation_source: BrandingBonusCalcSourceDto,
    programParams: BrandingCalculationProgramParamsDto,
  ): string {
    const completed = calculation_source.orders.completed || 0;
    const paramsOrdersCompletedCount = programParams?.orders?.completed?.count;
    const total =
      paramsOrdersCompletedCount?.length > 0
        ? paramsOrdersCompletedCount[paramsOrdersCompletedCount.length - 1]?.range?.[0]
        : 0;

    return `${completed}/${total}`;
  }
}
