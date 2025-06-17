import { CommissionRateDto } from '@data-access';

import { MinCommissionPipe } from './min-commission.pipe';

describe('MinCommissionPipe', () => {
  let pipe: MinCommissionPipe;

  beforeEach(() => {
    pipe = new MinCommissionPipe();
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return 0 when input array is empty', () => {
    expect(pipe.transform([])).toBe(0);
  });

  it('should return the minimum commission rate from multiple items', () => {
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
    ] as CommissionRateDto[];

    expect(pipe.transform(commissions)).toBe(0);
  });
});
