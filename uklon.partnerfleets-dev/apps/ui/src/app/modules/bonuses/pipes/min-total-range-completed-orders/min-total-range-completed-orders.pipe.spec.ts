import { CommissionRateDto } from '@data-access';

import { MinTotalRangeCompletedOrdersPipe } from './min-total-range-completed-orders.pipe';

describe('MinTotalRangeCompletedOrdersPipe', () => {
  let pipe = new MinTotalRangeCompletedOrdersPipe();

  beforeEach(() => {
    pipe = new MinTotalRangeCompletedOrdersPipe();
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return 0 for an empty array', () => {
    const result = pipe.transform([]);
    expect(result).toBe(0);
  });

  it('should return the minimum value "from"', () => {
    const commissions: CommissionRateDto[] = [
      { value: 10, order_completed_count_range: { from: 5, to: 10 } },
      { value: 15, order_completed_count_range: { from: 11, to: 20 } },
      { value: 20, order_completed_count_range: { from: 21, to: 30 } },
    ];
    const result = pipe.transform(commissions);
    expect(result).toBe(5);
  });

  it('should return the minimum "from" value when commissions are not sorted', () => {
    const commissions: CommissionRateDto[] = [
      { value: 20, order_completed_count_range: { from: 21, to: 30 } },
      { value: 10, order_completed_count_range: { from: 5, to: 10 } },
      { value: 15, order_completed_count_range: { from: 11, to: 20 } },
    ];
    const result = pipe.transform(commissions);
    expect(result).toBe(5);
  });

  it('should handle commissions with the same value but different ranges', () => {
    const commissions: CommissionRateDto[] = [
      { value: 15, order_completed_count_range: { from: 11, to: 20 } },
      { value: 10, order_completed_count_range: { from: 5, to: 10 } },
      { value: 20, order_completed_count_range: { from: 21, to: 30 } },
    ];
    const result = pipe.transform(commissions);
    expect(result).toBe(5);
  });

  it('should return "to" if it one active commission program', () => {
    const commissions: CommissionRateDto[] = [{ value: 10, order_completed_count_range: { from: 0, to: 5 } }];
    const result = pipe.transform(commissions);
    expect(result).toBe(5);
  });
});
