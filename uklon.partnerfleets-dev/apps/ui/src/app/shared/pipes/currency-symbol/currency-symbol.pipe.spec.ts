import { CurrencySymbolPipe } from './currency-symbol.pipe';

describe('CurrencySymbolPipe', () => {
  it('create an instance', () => {
    const pipe = new CurrencySymbolPipe('en');
    expect(pipe).toBeTruthy();
  });
});
