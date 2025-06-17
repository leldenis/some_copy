import { CountMaskPipe } from './count-mask.pipe';

describe('CountMaskPipe', () => {
  let pipe: CountMaskPipe;

  beforeEach(() => {
    pipe = new CountMaskPipe();
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return 0 if count is 0', () => {
    const masked = pipe.transform(0, 9);
    expect(masked).toMatch('0');
  });

  it('should mask number value', () => {
    const masked = pipe.transform(10, 9);
    expect(masked).toMatch('9+');
  });

  it('should mask string value', () => {
    const masked = pipe.transform('100', 55);
    expect(masked).toMatch('55+');
  });

  it('should not mask value', () => {
    const masked = pipe.transform(8, 9);
    expect(masked).toMatch('8');
  });

  it('should not transform value if value is not string or number', () => {
    const masked = pipe.transform({} as any, 9);
    expect(masked).toMatch('');
  });

  it('should not transform no value is provided', () => {
    const masked = pipe.transform(null, 9);
    expect(masked).toMatch('');
  });
});
