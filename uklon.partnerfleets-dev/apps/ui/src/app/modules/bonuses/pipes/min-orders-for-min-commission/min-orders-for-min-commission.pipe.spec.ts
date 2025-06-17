import { CommissionRateDto } from '@data-access';

import { MinOrdersForMinCommissionPipe } from './min-orders-for-min-commission.pipe';

describe('MinOrdersForMinCommissionPipe', () => {
  let pipe: MinOrdersForMinCommissionPipe;

  beforeEach(() => {
    pipe = new MinOrdersForMinCommissionPipe();
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return 0 for an empty array', () => {
    const result = pipe.transform([]);
    expect(result).toBe(0);
  });

  it('should return the minimum order count for a single commission rate', () => {
    const commissions: CommissionRateDto[] = [
      {
        value: 10,
        order_completed_count_range: { from: 5, to: 10 },
      },
    ];
    const result = pipe.transform(commissions);
    expect(result).toBe(5);
  });

  it('should return the minimum order count for multiple commission rates', () => {
    const commissions: CommissionRateDto[] = [
      {
        order_completed_count_range: {
          from: 0,
          to: 10,
        },
        value: 0.1,
      },
      {
        order_completed_count_range: {
          from: 21,
          to: 100,
        },
        value: 0,
      },
      {
        order_completed_count_range: {
          from: 11,
          to: 20,
        },
        value: 0.05,
      },
    ];
    const result = pipe.transform(commissions);
    expect(result).toBe(21);
  });
});
