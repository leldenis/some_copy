import { BrandingBonusCalcSourceDto, BrandingCalculationProgramParamsDto } from '@data-access';

import { IsCancellationPercentMorePipe } from './is-cancellation-percent-more.pipe';

describe('IsCancellationPercentMorePipe', () => {
  let pipe: IsCancellationPercentMorePipe;

  beforeEach(() => {
    pipe = new IsCancellationPercentMorePipe();
  });

  it('should return true if cancellation percentage is greater than the program params range', () => {
    const calculationSource: BrandingBonusCalcSourceDto = {
      orders: { cancellation_percentage: 15 },
    } as any;

    const programParams: BrandingCalculationProgramParamsDto = {
      orders: { cancelled: { percent: [{ range: [0, 10] }] } },
    } as any;

    expect(pipe.transform(calculationSource, programParams)).toBeTruthy();
  });

  it('should return false if cancellation percentage is equal to the upper limit of the range', () => {
    const calculationSource: BrandingBonusCalcSourceDto = {
      orders: { cancellation_percentage: 10 },
    } as any;

    const specification: BrandingCalculationProgramParamsDto = {
      orders: { cancelled: { percent: [{ range: [0, 10] }] } },
    } as any;

    expect(pipe.transform(calculationSource, specification)).toBeFalsy();
  });

  it('should return false if cancellation percentage is less than the program params range', () => {
    const calculationSource: BrandingBonusCalcSourceDto = {
      orders: { cancellation_percentage: 5 },
    } as any;

    const programParams: BrandingCalculationProgramParamsDto = {
      orders: { cancelled: { percent: [{ range: [0, 10] }] } },
    } as any;

    expect(pipe.transform(calculationSource, programParams)).toBeFalsy();
  });

  it('should handle undefined program params', () => {
    const calculationSource: BrandingBonusCalcSourceDto = {
      orders: { cancellation_percentage: 15 },
    } as any;

    expect(pipe.transform(calculationSource, undefined as any)).toBeFalsy();
  });

  it('should handle empty object in program params', () => {
    const calculationSource: BrandingBonusCalcSourceDto = {
      orders: { cancellation_percentage: 15 },
    } as any;

    expect(pipe.transform(calculationSource, {} as any)).toBeFalsy();
  });
});
