import { Pipe, PipeTransform } from '@angular/core';
import { RangeItemsDto } from '@data-access';

import { isNumber } from '@uklon/angular-core';

@Pipe({
  name: 'isRatingLess',
  standalone: true,
})
export class IsRatingLessPipe implements PipeTransform {
  public transform(rating: number, specRating?: RangeItemsDto): boolean {
    if (isNumber(rating) && specRating?.range?.[0] >= 0) {
      return rating / 100 < specRating.range[0];
    }

    return false;
  }
}
