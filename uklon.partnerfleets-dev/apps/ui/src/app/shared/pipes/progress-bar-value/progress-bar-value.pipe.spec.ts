import { ProgressBarValuePipe } from '@ui/shared';

describe('ProgressBarValuePipe', () => {
  let pipe: ProgressBarValuePipe;

  beforeEach(() => {
    pipe = new ProgressBarValuePipe();
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return 0 when total is 0', () => {
    expect(pipe.transform(5, 0)).toBe(0);
  });

  it('should return 0 when completed is negative', () => {
    expect(pipe.transform(-1, 10)).toBe(0);
  });

  it('should return 0 when total is negative', () => {
    expect(pipe.transform(5, -10)).toBe(0);
  });

  it('should return 33.33 when completed is 1 and total is 3', () => {
    expect(pipe.transform(1, 3)).toBe(33.33);
  });

  it('should return 66.67 when completed is 2 and total is 3', () => {
    expect(pipe.transform(2, 3)).toBe(66.67);
  });

  it('should return 100 when completed equals total', () => {
    expect(pipe.transform(10, 10)).toBe(100);
  });

  it('should return 100 when completed is greater than total', () => {
    expect(pipe.transform(15, 10)).toBe(100);
  });

  it('should round to 2 decimal places', () => {
    expect(pipe.transform(1, 3)).toBe(33.33);
    expect(pipe.transform(2, 3)).toBe(66.67);
    expect(pipe.transform(1, 6)).toBe(16.67);
  });

  it('should handle large numbers', () => {
    expect(pipe.transform(1_000_000, 3_000_000)).toBe(33.33);
  });

  it('should handle decimal inputs', () => {
    expect(pipe.transform(1.5, 3)).toBe(50);
    expect(pipe.transform(2.7, 3)).toBe(90);
  });
});
