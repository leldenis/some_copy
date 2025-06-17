import { NormalizeStringPipe } from './normalize-string.pipe';

describe('NormalizeStringPipe', () => {
  let pipe: NormalizeStringPipe;

  beforeEach(() => {
    pipe = new NormalizeStringPipe();
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return an empty string for null', () => {
    expect(pipe.transform(null)).toBe('');
  });

  it('should return an empty string for undefined', () => {
    // eslint-disable-next-line unicorn/no-useless-undefined
    expect(pipe.transform(undefined)).toBe('');
  });

  it('should normalize a string with spaces', () => {
    expect(pipe.transform('  Mini   Van ')).toBe('minivan');
  });

  it('should normalize a string without spaces', () => {
    expect(pipe.transform('EvacuationMedium')).toBe('evacuationmedium');
  });

  it('should correctly handle multiline whitespace', () => {
    expect(pipe.transform('Evacu\nation\tMedium')).toBe('evacuationmedium');
  });

  it('should return an empty string for an empty', () => {
    expect(pipe.transform('')).toBe('');
  });

  it('should remove spaces and convert to lowercase', () => {
    expect(pipe.transform('G r e e n')).toBe('green');
  });
});
