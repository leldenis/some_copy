import { KeyMaskPipe } from './key-mask.pipe';

describe('KeyMaskPipe', () => {
  let pipe: KeyMaskPipe;

  beforeEach(() => {
    pipe = new KeyMaskPipe();
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should mask the key correctly', () => {
    const key = '5E984D526F82F38F040000004F8DDC0013183405';
    const maskedKey = pipe.transform(key);
    expect(maskedKey).toBe('5E98...3405');
  });

  it('should handle short key correctly', () => {
    const shortKey = '5E984D52';
    const maskedShortKey = pipe.transform(shortKey);
    expect(maskedShortKey).toBe('5E984D52');
  });

  it('should handle very short key correctly', () => {
    const veryShortKey = '5E9';
    const maskedVeryShortKey = pipe.transform(veryShortKey);
    expect(maskedVeryShortKey).toBe('5E9');
  });

  it('should handle empty and null values', () => {
    const maskedEmptyKey = pipe.transform('');
    const maskedNullKey = pipe.transform(null);

    expect(maskedEmptyKey).toBe('');
    expect(maskedNullKey).toBe('');
  });
});
