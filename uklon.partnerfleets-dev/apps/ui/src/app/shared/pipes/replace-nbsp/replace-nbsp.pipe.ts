import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'replaceNbsp',
  standalone: true,
})
export class ReplaceNbspPipe implements PipeTransform {
  public transform(value: string): string {
    return value.replace(/&nbsp;/g, ' ');
  }
}
