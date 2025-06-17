import { periodPerDays } from '@ui/shared';

describe('periodPerDays', () => {
  const secondsInDay = 24 * 60 * 60;
  let now: number;

  beforeEach(() => {
    now = Math.floor(Date.now() / 1000);
  });

  it('should return a period equal from daysAgo to now', () => {
    const daysAgo = 30;
    const result = periodPerDays(daysAgo);
    expect(result.to).toBe(now);
    expect(result.from).toBe(now - daysAgo * secondsInDay);
  });

  it("should be daysAgo equal to difference between 'to' and 'from'", () => {
    const daysAgo = 30;
    const result = periodPerDays(daysAgo);
    const actualDays = Math.round((result.to - result.from) / secondsInDay);
    expect(actualDays).toBe(daysAgo);
  });

  it('should use default 30 days if no argument is provided', () => {
    const result = periodPerDays();
    expect(result.to).toBe(now);
    expect(result.from).toBe(now - 30 * secondsInDay);

    const actualDays = Math.round((result.to - result.from) / secondsInDay);
    expect(actualDays).toBe(30);
  });
});
