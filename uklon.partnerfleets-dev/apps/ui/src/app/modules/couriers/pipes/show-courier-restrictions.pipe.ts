import { Pipe, PipeTransform } from '@angular/core';
import { Restriction, RestrictionReason } from '@constant';
import { EmployeeRestrictionDetailsDto } from '@data-access';

@Pipe({
  name: 'showCourierRestrictions',
  standalone: true,
})
export class ShowCourierRestrictionsPipe implements PipeTransform {
  public transform(restrictions: EmployeeRestrictionDetailsDto[]): boolean {
    if (restrictions.length === 0) {
      return false;
    }

    let hasCashOrActivityRestriction = false;

    restrictions.forEach((item) => {
      hasCashOrActivityRestriction =
        item.restriction_items.some((restriction) => restriction.type === Restriction.CASH) ||
        item.restricted_by === RestrictionReason.ACTIVITY_RATE;
    });

    return hasCashOrActivityRestriction;
  }
}
