import { CommissionRateDto } from '@data-access';

import { SortCommissionsPipe } from './sort-commissions.pipe';

describe('SortCommissionsPipe', () => {
  let pipe: SortCommissionsPipe;

  beforeEach(() => {
    pipe = new SortCommissionsPipe();
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return an empty array when given an empty array', () => {
    const result = pipe.transform([]);
    expect(result).toEqual([]);
  });

  it('should sort commissions in descending order by value', () => {
    const commissions: CommissionRateDto[] = [
      { order_completed_count_range: { from: 8, to: 15 }, value: 0 },
      { order_completed_count_range: { from: 0, to: 3 }, value: 0.7 },
      { order_completed_count_range: { from: 4, to: 7 }, value: 0.4 },
    ];
    const expected: CommissionRateDto[] = [
      { order_completed_count_range: { from: 0, to: 3 }, value: 0.7 },
      { order_completed_count_range: { from: 4, to: 7 }, value: 0.4 },
      { order_completed_count_range: { from: 8, to: 15 }, value: 0 },
    ];
    const result = pipe.transform(commissions);
    expect(result).toEqual(expected);
  });

  it('should handle commissions with the same value', () => {
    const commissions: CommissionRateDto[] = [
      { order_completed_count_range: { from: 8, to: 15 }, value: 0 },
      { order_completed_count_range: { from: 0, to: 3 }, value: 0.7 },
      { order_completed_count_range: { from: 0, to: 3 }, value: 0.7 },
      { order_completed_count_range: { from: 4, to: 7 }, value: 0.4 },
    ];
    const expected: CommissionRateDto[] = [
      { order_completed_count_range: { from: 0, to: 3 }, value: 0.7 },
      { order_completed_count_range: { from: 0, to: 3 }, value: 0.7 },
      { order_completed_count_range: { from: 4, to: 7 }, value: 0.4 },
      { order_completed_count_range: { from: 8, to: 15 }, value: 0 },
    ];
    const result = pipe.transform(commissions);
    expect(result).toEqual(expected);
  });
});
