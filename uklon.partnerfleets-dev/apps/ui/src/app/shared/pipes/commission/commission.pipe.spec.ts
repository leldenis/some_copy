import { MoneyDto } from '@data-access';

import { Currency } from '@uklon/types';

import { CommissionPipe } from './commission.pipe';

const MONEY = (amount: number): MoneyDto => {
  return {
    amount,
    currency: Currency.UAH,
  };
};

describe('CommissionPipe', () => {
  let pipe: CommissionPipe;

  const positiveCases = [
    {
      profit: MONEY(10),
      loss: MONEY(-10),
      expected: {
        total: MONEY(-20),
        profit: MONEY(-10),
      },
    },
    {
      profit: MONEY(-5),
      loss: MONEY(-10),
      expected: {
        total: MONEY(-5),
        profit: MONEY(-10),
      },
    },
  ];
  const negativeCases = [
    {
      profit: MONEY(10),
      loss: undefined as undefined,
    },
    {
      profit: undefined as undefined,
      loss: MONEY(-10),
    },
  ];

  beforeEach(() => {
    pipe = new CommissionPipe();
  });

  it('create an instance', () => {
    pipe = new CommissionPipe();
    expect(pipe).toBeTruthy();
  });

  describe.each(positiveCases)('When all parameters are valid', ({ profit, loss, expected }) => {
    it('should calculate commission', () => {
      const commission = pipe.transform(loss, profit);
      expect(commission.total.amount).toBe(expected.total.amount);
      expect(commission.profit.amount).toBe(expected.profit.amount);
    });
  });

  describe.each(negativeCases)('When profit or loss is undefined', ({ profit, loss }) => {
    it(`should return null if ${profit ? 'loss' : 'profit'} is undefined`, () => {
      const commission = pipe.transform(loss, profit);
      expect(commission).toBeNull();
      expect(commission).toBeNull();
    });
  });
});
