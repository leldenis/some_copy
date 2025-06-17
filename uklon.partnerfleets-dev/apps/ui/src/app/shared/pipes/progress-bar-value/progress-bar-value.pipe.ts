import { Pipe, PipeTransform } from '@angular/core';

const CONVERT_TO_PERCENTAGE = 100;
const MAX_VALUE = 100;
const DECIMAL_PLACES = 2;

@Pipe({
  name: 'progressBarValue',
  standalone: true,
})
export class ProgressBarValuePipe implements PipeTransform {
  public transform(completed: number, total: number): number {
    if (total <= 0 || completed < 0) {
      return 0;
    }

    const value = Math.min(MAX_VALUE, Math.max(0, (completed / total) * CONVERT_TO_PERCENTAGE));
    return Number(value.toFixed(DECIMAL_PLACES));
  }
}
