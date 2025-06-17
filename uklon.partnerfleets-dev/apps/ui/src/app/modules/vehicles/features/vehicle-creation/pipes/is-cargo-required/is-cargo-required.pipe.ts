import { Pipe, PipeTransform } from '@angular/core';
import { BodyType, LoadCapacity } from '@constant';

@Pipe({
  name: 'isCargoRequired',
  standalone: true,
})
export class IsCargoRequiredPipe implements PipeTransform {
  public transform(bodyType: BodyType, loadCapacity: LoadCapacity): boolean {
    return (
      bodyType === BodyType.CARGO &&
      ![LoadCapacity.SMALL, LoadCapacity.MEDIUM, LoadCapacity.LARGE].includes(loadCapacity)
    );
  }
}
