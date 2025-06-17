import { Pipe, PipeTransform } from '@angular/core';
import { BrandingBonusCalcSourceDto, BrandingBonusSpecOldDto } from '@data-access';

@Pipe({
  name: 'isCancellationPercentMoreOld',
  standalone: true,
})
export class IsCancellationPercentMoreOldPipe implements PipeTransform {
  public transform(calculation_source: BrandingBonusCalcSourceDto, specification: BrandingBonusSpecOldDto): boolean {
    return calculation_source.orders.cancellation_percentage > specification?.orders?.cancelled.percent[0].range[1];
  }
}
