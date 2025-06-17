import { removeEmptyParams } from '@ui/shared';

const negativeTestCases = [
  {
    values: { a: 1, b: 2, c: '' },
    description: "''",
  },
  {
    values: { a: 1, b: 2, c: null },
    description: 'null',
  },
  {
    values: { a: 1, b: 2, c: undefined },
    description: 'undefined',
  },
];
const positiveTestCases = [
  {
    values: { a: 1, b: 2, c: false },
    description: 'false',
  },
  {
    values: { a: 1, b: 2, c: 0 },
    description: '0',
  },
  {
    values: { a: 1, b: 2, c: [] as any[] },
    description: '[]',
  },
  {
    values: { a: 1, b: 2, c: {} },
    description: '{}',
  },
];
global.structuredClone = (val) => JSON.parse(JSON.stringify(val));

describe('removeEmptyParams', () => {
  describe.each(negativeTestCases)('remove empty property', (negative) => {
    it(`should remove record entry if its value is ${negative.description}`, () => {
      const result = removeEmptyParams(negative.values);

      expect(result.a).toEqual(negative.values.a);
      expect(result.b).toEqual(negative.values.b);
      expect(result).not.toHaveProperty('c');
    });
  });

  describe.each(positiveTestCases)('keep falsy property', (testCase) => {
    it(`should keep record entry if its value is ${testCase.description}`, () => {
      const result = removeEmptyParams(testCase.values);

      expect(result.a).toEqual(testCase.values.a);
      expect(result.b).toEqual(testCase.values.b);
      expect(result.c).toEqual(testCase.values.c);
    });
  });
});
