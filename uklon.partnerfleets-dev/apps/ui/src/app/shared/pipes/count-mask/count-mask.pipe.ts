import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'countMask',
  standalone: true,
})
export class CountMaskPipe implements PipeTransform {
  public transform(value: string | number | null, max: number): string {
    if (value === 0) return '0';

    if (value && (typeof value === 'number' || typeof value === 'string')) {
      return Number(value) > max ? `${max}+` : `${value}`;
    }

    return '';
  }
}
