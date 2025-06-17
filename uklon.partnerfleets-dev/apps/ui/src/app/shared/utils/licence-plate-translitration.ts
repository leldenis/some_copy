const TRANSLITERATION_SYMBOLS: Record<string, string> = {
  А: 'A',
  В: 'B',
  С: 'C',
  К: 'K',
  Е: 'E',
  Н: 'H',
  Р: 'P',
  О: 'O',
  І: 'I',
  Х: 'X',
  М: 'M',
  Т: 'T',
};

/**
 *
 * @param str string
 * @returns string with Cyrillic letters replaced with Latin letters
 */
export function transliterate(str: string): string {
  if (!str) return str;

  let result = '';

  for (let i = 0; i < str.length; i += 1) {
    const symbol = TRANSLITERATION_SYMBOLS[str.charAt(i).toUpperCase()] || str.charAt(i);
    result += symbol;
  }

  return result;
}
