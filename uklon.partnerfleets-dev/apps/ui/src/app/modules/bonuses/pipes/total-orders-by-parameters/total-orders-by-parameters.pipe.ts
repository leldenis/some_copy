import { Pipe, PipeTransform } from '@angular/core';
import { BrandingBonusSpecOrderCountDto } from '@data-access';

@Pipe({
  name: 'totalOrdersByParameters',
  standalone: true,
})
export class TotalOrdersByParametersPipe implements PipeTransform {
  public transform(parametersOrdersCompleted: BrandingBonusSpecOrderCountDto[]): number {
    return (
      (parametersOrdersCompleted.length > 0 &&
        parametersOrdersCompleted[parametersOrdersCompleted.length - 1]?.range[0]) ||
      0
    );
  }
}
