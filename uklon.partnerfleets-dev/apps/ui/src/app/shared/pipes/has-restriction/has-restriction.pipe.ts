import { Pipe, PipeTransform } from '@angular/core';
import { RestrictionReason } from '@constant';
import { EmployeeRestrictionDetailsDto } from '@data-access';

@Pipe({
  name: 'hasRestriction',
  standalone: true,
})
export class HasRestrictionPipe implements PipeTransform {
  public transform(
    restrictions: EmployeeRestrictionDetailsDto[] | undefined,
    restrictionReason: RestrictionReason,
    fleetId: string,
  ): EmployeeRestrictionDetailsDto | null {
    if (!restrictions || !restrictions?.length) return null;

    return (
      restrictions.find(
        ({ restricted_by, restriction_items }) =>
          restricted_by === restrictionReason &&
          (restriction_items.some(({ fleet_id }) => fleet_id === fleetId) ||
            restriction_items.every(({ fleet_id }) => !fleet_id)),
      ) ?? null
    );
  }
}
