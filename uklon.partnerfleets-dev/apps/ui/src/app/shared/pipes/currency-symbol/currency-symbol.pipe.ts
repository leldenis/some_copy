import { getCurrencySymbol } from '@angular/common';
import { Inject, LOCALE_ID, Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'currencySymbol',
  standalone: true,
})
export class CurrencySymbolPipe implements PipeTransform {
  constructor(@Inject(LOCALE_ID) private readonly locale: string) {}

  public transform(value: string, locale = this.locale): string {
    return getCurrencySymbol(value, 'narrow', locale);
  }
}
