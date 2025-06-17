import { FleetOrderRecordDto } from '@data-access';
import { getMerchants, getMerchantsIncome } from '@ui/modules/orders/constants/index';
import { ORDER_REPORT_ITEM_1_MOCK, ORDER_REPORT_ITEM_4_MOCK } from '@ui/modules/orders/services/reports.mock';

const REPORT = ORDER_REPORT_ITEM_1_MOCK as unknown as FleetOrderRecordDto;
const REPORT_2 = ORDER_REPORT_ITEM_4_MOCK as unknown as FleetOrderRecordDto;
const MERCHANTS = ['Fondy', 'IPay', 'Platon'];

describe('Orders constants', () => {
  describe('getMerchants', () => {
    it('should get all merchants from report', () => {
      const expected = new Set(MERCHANTS);
      const merchants = getMerchants([REPORT]);
      const valid = merchants.every((merchant) => expected.has(merchant));

      expect(merchants).toHaveLength(MERCHANTS.length);
      expect(valid).toBeTruthy();
    });

    it('should get all merchants from multiple reports', () => {
      const expected = new Set(MERCHANTS);
      const merchants = getMerchants([REPORT, REPORT_2]);
      const valid = merchants.every((merchant) => expected.has(merchant));

      expect(merchants).toHaveLength(MERCHANTS.length);
      expect(valid).toBeTruthy();
    });

    it('should return empty array is there are no split payments', () => {
      const merchants = getMerchants([{ ...REPORT, grouped_splits: {} }]);
      expect(merchants).toHaveLength(0);
    });
  });

  describe('getMerchantsIncome', () => {
    it('should map all entrepreneurs merchants to income array', () => {
      const incomeArray = getMerchantsIncome(REPORT.grouped_splits, MERCHANTS);
      expect(incomeArray).toHaveLength(MERCHANTS.length * 2);
      incomeArray.forEach((income, index) => {
        if ((index + 1) % 2 === 0) {
          expect(income).toBe(101);
          return;
        }

        expect(income).toBe(16_000);
      });
    });

    it('should map all entrepreneurs merchants from multiple sources to income array', () => {
      const incomeArray = getMerchantsIncome({ ...REPORT.grouped_splits, ...REPORT_2.grouped_splits }, MERCHANTS);
      expect(incomeArray).toHaveLength(MERCHANTS.length * 2);
      incomeArray.forEach((income, index) => {
        if ((index + 1) % 2 === 0) {
          expect(income).toBe(101);
          return;
        }

        expect(income).toBe(32_000);
      });
    });

    it('should return array of merchants array params length filled with [0, 0]', () => {
      const incomeArray = getMerchantsIncome({}, MERCHANTS);
      const columnCountForOneMerchant = 2;
      expect(incomeArray).toHaveLength(MERCHANTS.length * columnCountForOneMerchant);
      incomeArray.forEach((income) => expect(income).toBe(0));
    });
  });
});
