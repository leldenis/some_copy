import { transliterate } from '@ui/shared';

describe('Transliterate function', () => {
  test('should transliterate Cyrillic to Latin letters', () => {
    const allCyrillicLetters = 'АВСКЕНРОІХМТ';
    expect(transliterate(allCyrillicLetters)).toBe('ABCKEHPOIXMT');
  });

  test('should handle mixed Cyrillic and Latin letters', () => {
    const cyrillicLetters = 'КМНОР';
    expect(transliterate(`ABCE${cyrillicLetters}IXT`)).toBe('ABCEKMHOPIXT');
  });

  test('should transliterate Cyrillic to Latin letters', () => {
    expect(transliterate('ВМ1000СМ')).toBe('BM1000CM');
  });

  test('should return same string if no Cyrillic letters', () => {
    expect(transliterate('Hello123')).toBe('Hello123');
  });

  test('should handle empty string', () => {
    expect(transliterate('')).toBe('');
  });

  test('should transliterate lowercase Cyrillic letters', () => {
    expect(transliterate('авсекмноріхт')).toBe('ABCEKMHOPIXT');
  });
});
