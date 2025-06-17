import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'max',
  standalone: true,
})
export class MaxPipe implements PipeTransform {
  public transform(values: number[]): number {
    return values?.length > 0 ? Math.max(...values) : null;
  }
}
