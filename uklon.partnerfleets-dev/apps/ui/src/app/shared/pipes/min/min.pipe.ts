import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'min',
  standalone: true,
})
export class MinPipe implements PipeTransform {
  public transform(values: number[]): number {
    return values?.length > 0 ? Math.min(...values) : null;
  }
}
