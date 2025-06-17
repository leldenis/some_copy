import { Pipe, PipeTransform } from '@angular/core';
import { DistanceUnit } from '@ui/shared/enums';

const MILES_COEFFICIENT = 0.6214;

@Pipe({
  name: 'metersToDistance',
  standalone: true,
})
export class MetersToDistancePipe implements PipeTransform {
  public transform(meters: number, unit: DistanceUnit = DistanceUnit.KILOMETER): number | string {
    if (!meters) {
      return 0;
    }

    switch (unit) {
      case DistanceUnit.KILOMETER:
        return (meters / 1000).toFixed(1);
      case DistanceUnit.MILE:
        return ((meters / 1000) * MILES_COEFFICIENT).toFixed(1);
      default:
        return meters;
    }
  }
}
