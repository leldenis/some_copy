import { DatePipe } from '@angular/common';
import { Inject, LOCALE_ID, Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'seconds2Date',
  standalone: true,
})
export class Seconds2DatePipe implements PipeTransform {
  constructor(@Inject(LOCALE_ID) private readonly locale: string) {}

  public transform(ms: number, format = 'dd.MM.yyyy'): string {
    if (ms) {
      const pipe = new DatePipe(this.locale);
      return pipe.transform(ms * 1000, format);
    }

    return '';
  }
}
