import { CommissionRateDto } from '@data-access';

import { CurrentCommissionFromRangePipe } from './current-commission-from-range.pipe';

describe('CurrentCommissionFromRangePipe', () => {
  let pipe = new CurrentCommissionFromRangePipe();

  beforeEach(() => {
    pipe = new CurrentCommissionFromRangePipe();
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return 0 when commissions array is empty', () => {
    const result = pipe.transform(10, []);
    expect(result).toBe(0);
  });

  it('should return correct commission value when within a range', () => {
    const commissions: CommissionRateDto[] = [
      { order_completed_count_range: { from: 0, to: 10 }, value: 0.05 },
      { order_completed_count_range: { from: 11, to: 20 }, value: 0.1 },
      { order_completed_count_range: { from: 21, to: 30 }, value: 0.15 },
    ];

    expect(pipe.transform(5, commissions)).toBe(5);
    expect(pipe.transform(15, commissions)).toBe(10);
    expect(pipe.transform(25, commissions)).toBe(15);
  });

  it('should return 0 when current completed orders is below all ranges', () => {
    const commissions: CommissionRateDto[] = [
      { order_completed_count_range: { from: 10, to: 20 }, value: 0.05 },
      { order_completed_count_range: { from: 21, to: 30 }, value: 0.1 },
    ];

    expect(pipe.transform(5, commissions)).toBe(0);
  });

  it('should return 0 when current completed orders is above all ranges', () => {
    const commissions: CommissionRateDto[] = [
      { order_completed_count_range: { from: 0, to: 10 }, value: 0.05 },
      { order_completed_count_range: { from: 11, to: 20 }, value: 0.1 },
    ];

    expect(pipe.transform(25, commissions)).toBe(0);
  });

  it('should handle decimal commission values', () => {
    const commissions: CommissionRateDto[] = [{ order_completed_count_range: { from: 0, to: 10 }, value: 0.075 }];

    expect(pipe.transform(5, commissions)).toBe(7.5);
  });
});
