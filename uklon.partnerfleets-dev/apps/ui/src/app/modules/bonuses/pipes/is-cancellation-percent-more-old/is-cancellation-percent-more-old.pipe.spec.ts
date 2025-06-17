import { BrandingBonusCalcSourceDto, BrandingBonusSpecOldDto } from '@data-access';

import { IsCancellationPercentMoreOldPipe } from './is-cancellation-percent-more-old.pipe';

describe('IsCancellationPercentMoreOldPipe', () => {
  let pipe: IsCancellationPercentMoreOldPipe;

  beforeEach(() => {
    pipe = new IsCancellationPercentMoreOldPipe();
  });

  it('should return true if cancellation percentage is greater than the specified range', () => {
    const calculationSource: BrandingBonusCalcSourceDto = {
      orders: { cancellation_percentage: 15 },
    } as any;

    const specification: BrandingBonusSpecOldDto = {
      orders: { cancelled: { percent: [{ range: [0, 10] }] } },
    } as any;

    expect(pipe.transform(calculationSource, specification)).toBeTruthy();
  });

  it('should return false if cancellation percentage is equal to the upper limit of the range', () => {
    const calculationSource: BrandingBonusCalcSourceDto = {
      orders: { cancellation_percentage: 10 },
    } as any;

    const specification: BrandingBonusSpecOldDto = {
      orders: { cancelled: { percent: [{ range: [0, 10] }] } },
    } as any;

    expect(pipe.transform(calculationSource, specification)).toBeFalsy();
  });

  it('should return false if cancellation percentage is less than the specified range', () => {
    const calculationSource: BrandingBonusCalcSourceDto = {
      orders: { cancellation_percentage: 5 },
    } as any;

    const specification: BrandingBonusSpecOldDto = {
      orders: { cancelled: { percent: [{ range: [0, 10] }] } },
    } as any;

    expect(pipe.transform(calculationSource, specification)).toBeFalsy();
  });

  it('should handle undefined specification', () => {
    const calculationSource: BrandingBonusCalcSourceDto = {
      orders: { cancellation_percentage: 15 },
    } as any;

    expect(pipe.transform(calculationSource, undefined as any)).toBeFalsy();
  });

  it('should handle empty object in specification', () => {
    const calculationSource: BrandingBonusCalcSourceDto = {
      orders: { cancellation_percentage: 15 },
    } as any;

    expect(pipe.transform(calculationSource, {} as any)).toBeFalsy();
  });
});
