import { DatePipe } from '@angular/common';
import { Inject, LOCALE_ID, Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'seconds2Time',
  standalone: true,
})
export class Seconds2TimePipe implements PipeTransform {
  constructor(@Inject(LOCALE_ID) private readonly locale: string) {}

  public transform(ms: number): string {
    if (ms) {
      const pipe = new DatePipe(this.locale);
      return pipe.transform(ms * 1000, 'HH:mm');
    }

    return '';
  }
}
