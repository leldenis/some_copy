import { Pipe, PipeTransform } from '@angular/core';
import { normalizeString } from '@ui/shared/utils/normalize-string';

@Pipe({
  name: 'normalizeString',
  standalone: true,
})
export class NormalizeStringPipe implements PipeTransform {
  public transform(value: string): string {
    return normalizeString(value);
  }
}
