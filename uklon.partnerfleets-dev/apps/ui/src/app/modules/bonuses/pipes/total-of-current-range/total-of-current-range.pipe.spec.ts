import { CommissionRateDto } from '@data-access';

import { TotalOfCurrentRangePipe } from './total-of-current-range.pipe';

describe('TotalOfCurrentRangePipe', () => {
  let pipe: TotalOfCurrentRangePipe;

  beforeEach(() => {
    pipe = new TotalOfCurrentRangePipe();
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return 0 when commissions array is empty', () => {
    const result = pipe.transform(10, []);
    expect(result).toBe(0);
  });

  it('should return the correct "to" value when completedOrders from current range', () => {
    const commissions: CommissionRateDto[] = [
      { order_completed_count_range: { from: 0, to: 10 } },
      { order_completed_count_range: { from: 11, to: 20 } },
      { order_completed_count_range: { from: 21, to: 30 } },
    ] as CommissionRateDto[];

    expect(pipe.transform(5, commissions)).toBe(10);
    expect(pipe.transform(12, commissions)).toBe(20);
    expect(pipe.transform(25, commissions)).toBe(30);
  });

  it('should return 0 when completedOrders is not within any range', () => {
    const commissions: CommissionRateDto[] = [
      { order_completed_count_range: { from: 0, to: 10 } },
      { order_completed_count_range: { from: 21, to: 30 } },
    ] as CommissionRateDto[];

    expect(pipe.transform(15, commissions)).toBe(0);
  });

  it('should handle negative completedOrders', () => {
    const commissions: CommissionRateDto[] = [
      { order_completed_count_range: { from: -10, to: 0 } },
      { order_completed_count_range: { from: 1, to: 10 } },
    ] as CommissionRateDto[];

    expect(pipe.transform(-5, commissions)).toBe(0);
    expect(pipe.transform(5, commissions)).toBe(10);
  });
});
