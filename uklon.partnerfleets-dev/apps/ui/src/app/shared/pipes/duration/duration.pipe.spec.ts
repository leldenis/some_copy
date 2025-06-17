import { DurationPipe } from './duration.pipe';

describe('DurationPipe', () => {
  let pipe: DurationPipe;

  beforeEach(() => {
    pipe = new DurationPipe();
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  const testCases = [
    { value: 100_000, expected: { hours: '27', minutes: '47' } },
    { value: 10_000, expected: { hours: '02', minutes: '47' } },
    { value: 7600, expected: { hours: '02', minutes: '07' } },
    { value: 57, expected: { minutes: '01' } },
    { value: 1, expected: { minutes: '01' } },
  ];

  describe.each(testCases)('when value is $value seconds', ({ value, expected }) => {
    it(`should be ${expected.hours} hours and ${expected.minutes}`, () => {
      const actual = pipe.transform(value);
      expect(actual).toEqual(expected);
    });
  });
});
