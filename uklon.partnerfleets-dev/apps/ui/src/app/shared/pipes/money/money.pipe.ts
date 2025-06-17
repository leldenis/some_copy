import { coerceNumberProperty } from '@angular/cdk/coercion';
import { formatNumber, getCurrencySymbol } from '@angular/common';
import { DEFAULT_CURRENCY_CODE, Inject, LOCALE_ID, Pipe, PipeTransform } from '@angular/core';
import { RTL_CURRENCIES } from '@ui/shared/consts/rtl-currencies.const';

export type MoneyDisplayType = 'both' | 'without-plus';

const DEFAULT_NUMBER_GROUPING_SYMBOL = ' ';

function getGroupingSymbol(locale: string): string {
  const formatter = Intl.NumberFormat(locale, { useGrouping: true });
  const testValue = formatter.format(100_000_000);
  const matches = testValue.match(/\D/g);

  if (matches.length > 0) {
    return matches[0];
  }

  return DEFAULT_NUMBER_GROUPING_SYMBOL;
}

@Pipe({
  name: 'upfMoney',
  standalone: true,
})
export class MoneyPipe implements PipeTransform {
  private static groupingSymbol: string;

  constructor(
    @Inject(DEFAULT_CURRENCY_CODE) private readonly _defaultCurrencyCode: string,
    @Inject(LOCALE_ID) private readonly localeId: string,
  ) {
    MoneyPipe.groupingSymbol = getGroupingSymbol(this.localeId);
  }

  public transform(
    value: unknown,
    currency: string,
    displayType?: MoneyDisplayType,
    symbol = ' ',
    currentLocale?: string,
    skipSymbol = false,
  ): string {
    let locale = currentLocale;
    if (!locale) locale = this.localeId;

    const currencySymbol = skipSymbol || !currency ? '' : getCurrencySymbol(currency, 'narrow');
    const numberValue = coerceNumberProperty(value, 0);
    const normalizedValue = this.getNormalizedValue(numberValue, locale, symbol);

    const result = RTL_CURRENCIES[currency] ? [normalizedValue, currencySymbol] : [currencySymbol, normalizedValue];

    if (displayType === 'both' && numberValue > 0) {
      result.unshift('+');
    } else if (numberValue < 0) {
      result.unshift('-');
    }

    return result.join(' ').replace(',', ' ').replace('  ', ' ').trim();
  }

  private getNormalizedValue(numberValue: number, locale: string, symbol: string): string {
    const normalizedValue = formatNumber(Math.abs(numberValue), locale, '1.2-2');

    if (!symbol) {
      return normalizedValue;
    }

    const groupingSymbol = locale ? getGroupingSymbol(locale) : MoneyPipe.groupingSymbol;

    return normalizedValue.replace(groupingSymbol, symbol);
  }
}
