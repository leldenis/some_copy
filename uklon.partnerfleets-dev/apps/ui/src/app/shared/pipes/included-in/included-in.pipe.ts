import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'includedIn',
  standalone: true,
})
export class IncludedInPipe implements PipeTransform {
  public transform<T>(value: T, array: T[]): boolean {
    if (!array?.length) return false;

    return array.includes(value);
  }
}
