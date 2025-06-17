import { DEFAULT_CURRENCY_CODE, LOCALE_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { MoneyDisplayType, MoneyPipe } from './money.pipe';

describe('MoneyPipe', () => {
  let pipe: MoneyPipe;
  let localeId: string;
  let defaultCurrencyCode: string;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MoneyPipe],
    });

    localeId = TestBed.inject(LOCALE_ID);
    defaultCurrencyCode = TestBed.inject(DEFAULT_CURRENCY_CODE);
  });

  it('should create', () => {
    pipe = new MoneyPipe(defaultCurrencyCode, localeId);

    expect(pipe).toBeTruthy();
  });

  describe('when transform', () => {
    beforeEach(() => {
      pipe = new MoneyPipe(defaultCurrencyCode, localeId);
    });

    const valueTestCases = [
      { value: 10, expected: '$ 10.00', expectedNoCurrency: '10.00' },
      { value: '10', expected: '$ 10.00', expectedNoCurrency: '10.00' },
      { value: -10, expected: '- $ 10.00', expectedNoCurrency: '- 10.00' },
      { value: '-10', expected: '- $ 10.00', expectedNoCurrency: '- 10.00' },
      { value: 0, expected: '$ 0.00', expectedNoCurrency: '0.00' },
      { value: Number.NaN, expected: '$ 0.00', expectedNoCurrency: '0.00' },
      { value: undefined, expected: '$ 0.00', expectedNoCurrency: '0.00' },
      { value: null, expected: '$ 0.00', expectedNoCurrency: '0.00' },
      { value: [''], expected: '$ 0.00', expectedNoCurrency: '0.00' },
      { value: {}, expected: '$ 0.00', expectedNoCurrency: '0.00' },
    ];

    describe.each(valueTestCases)('when value is "$value"', ({ value, expected, expectedNoCurrency }) => {
      it(`should return "${expected}"`, () => {
        const actual = pipe.transform(value, defaultCurrencyCode, undefined, localeId);
        expect(actual).toBe(expected);
      });

      const currencyTestCases = [{ currency: undefined }, { currency: null }, { currency: '' }];

      describe.each(currencyTestCases)('when currency is "$currency"', ({ currency }) => {
        it(`should return "${expected}"`, () => {
          const actual = pipe.transform(value, currency, undefined, localeId);
          expect(actual).toBe(expectedNoCurrency);
        });
      });

      const localeTestCases = [{ locale: undefined }, { locale: null }, { locale: '' }];

      describe.each(localeTestCases)('when locale is "$locale"', ({ locale }) => {
        it(`should return "${expected}"`, () => {
          const actual = pipe.transform(value, defaultCurrencyCode, undefined, locale);
          expect(actual).toBe(expected);
        });
      });

      const displayTestCases: { display?: MoneyDisplayType; value: unknown; expected: string }[] = [
        { display: 'both', value: 10, expected: '+ $ 10.00' },
      ];

      describe.each(displayTestCases)('when display is "$display"', (item) => {
        it(`should return "${item.expected}"`, () => {
          const actual = pipe.transform(item.value, defaultCurrencyCode, item.display, localeId);
          expect(actual).toBe(item.expected);
        });
      });
    });
  });
});
