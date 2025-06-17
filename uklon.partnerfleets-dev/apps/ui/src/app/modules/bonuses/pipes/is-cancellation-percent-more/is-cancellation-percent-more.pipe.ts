import { Pipe, PipeTransform } from '@angular/core';
import { BrandingBonusCalcSourceDto, BrandingCalculationProgramParamsDto } from '@data-access';

@Pipe({
  name: 'isCancellationPercentMore',
  standalone: true,
})
export class IsCancellationPercentMorePipe implements PipeTransform {
  public transform(
    calculation_source: BrandingBonusCalcSourceDto,
    programParams: BrandingCalculationProgramParamsDto,
  ): boolean {
    return calculation_source.orders.cancellation_percentage > programParams?.orders?.cancelled.percent[0].range[1];
  }
}
