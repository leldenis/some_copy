import { BrandingBonusCalcSourceDto, BrandingBonusSpecOldDto } from '@data-access';

import { OrdersCompletedOldPipe } from './orders-completed-old.pipe';

describe('OrdersCompletedOldPipe', () => {
  let pipe: OrdersCompletedOldPipe;

  beforeEach(() => {
    pipe = new OrdersCompletedOldPipe();
  });

  it('should return the correct completed orders count', () => {
    const calculationSource: BrandingBonusCalcSourceDto = {
      orders: { completed: 543 },
    } as any;

    const specification: BrandingBonusSpecOldDto = {
      orders: {
        completed: {
          count: [
            { value: 4000, range: [400, 600] },
            { value: 5500, range: [600, 9999] },
          ],
        },
      },
    } as any;

    expect(pipe.transform(calculationSource, specification)).toBe('543/600');
  });

  it('should return 0 if calculation source has no completed orders', () => {
    const calculationSource: BrandingBonusCalcSourceDto = {
      orders: {},
    } as any;

    const specification: BrandingBonusSpecOldDto = {
      orders: { completed: { count: [{ range: [10, 50] }] } },
    } as any;

    expect(pipe.transform(calculationSource, specification)).toBe('0/10');
  });

  it('should return 0/0 if specification orders completed count is missing', () => {
    const calculationSource: BrandingBonusCalcSourceDto = {
      orders: { completed: 20 },
    } as any;

    const specification: BrandingBonusSpecOldDto = {
      orders: { completed: {} },
    } as any;

    expect(pipe.transform(calculationSource, specification)).toBe('20/0');
  });

  it('should handle undefined specification', () => {
    const calculationSource: BrandingBonusCalcSourceDto = {
      orders: { completed: 20 },
    } as any;

    expect(pipe.transform(calculationSource, undefined as any)).toBe('20/0');
  });

  it('should return 0/0 if both values are missing', () => {
    const calculationSource: BrandingBonusCalcSourceDto = {
      orders: {},
    } as any;

    const specification: BrandingBonusSpecOldDto = {} as any;

    expect(pipe.transform(calculationSource, specification)).toBe('0/0');
  });
});
