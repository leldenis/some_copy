import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchHighlight',
  standalone: true,
})
export class SearchHighlightPipe implements PipeTransform {
  public transform(value: string, searchCondition: string): string {
    if (!searchCondition || !value) {
      return value;
    }

    const regex = new RegExp(searchCondition, 'gi');
    const match = regex.exec(value);

    if (!match) {
      return value;
    }

    return value.replace(regex, `<b>${match[0]}</b>`);
  }
}
