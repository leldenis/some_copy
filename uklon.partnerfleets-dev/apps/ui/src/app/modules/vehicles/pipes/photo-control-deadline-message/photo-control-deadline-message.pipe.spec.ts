import { PhotoControlDeadlineMessagePipe } from '@ui/modules/vehicles/pipes/photo-control-deadline-message/photo-control-deadline-message.pipe';
import moment from 'moment';

describe('PhotoControlDeadlineMessage', () => {
  let pipe: PhotoControlDeadlineMessagePipe;

  beforeEach(() => {
    pipe = new PhotoControlDeadlineMessagePipe();
    jest.useFakeTimers().setSystemTime(new Date('2025-01-15T16:00:00').getTime());
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  const testCases = [
    { deadline: 1_736_762_399, expectedDays: 2, passed: true }, // 13.01.25 11:59:59
    { deadline: 1_736_805_599, expectedDays: 1, passed: true }, // 13.01.25 23:59:59
    { deadline: 1_736_848_799, expectedDays: 1, passed: true }, // 14.01.25 11:59:59
    { deadline: 1_736_891_999, expectedDays: 0, passed: true }, // 14.01.25 23:59:59
    { deadline: 1_736_935_199, expectedDays: 0, passed: true }, // 15.01.25 11:59:59
    { deadline: 1_736_978_399, expectedDays: 1, passed: false }, // 15.01.25 23:59:59
    { deadline: 1_736_978_401, expectedDays: 1, passed: false }, // 16.01.25 00:00:01
    { deadline: 1_737_021_599, expectedDays: 1, passed: false }, // 16.01.25 11:59:59
    { deadline: 1_737_064_799, expectedDays: 2, passed: false }, // 16.01.25 23:59:59
    { deadline: 1_737_064_801, expectedDays: 2, passed: false }, // 17.01.25 00:00:01
    { deadline: 1_737_107_999, expectedDays: 2, passed: false }, // 17.01.25 11:59:59
    { deadline: 1_737_151_199, expectedDays: 3, passed: false }, // 17.01.25 23:59:59
    { deadline: 1_737_151_201, expectedDays: 3, passed: false }, // 18.01.25 00:00:01
    { deadline: 1_737_194_399, expectedDays: 3, passed: false }, // 18.01.25 11:59:59
    { deadline: 1_737_237_599, expectedDays: 4, passed: false }, // 18.01.25 23:59:59
  ];

  testCases.forEach(({ deadline, expectedDays, passed }, index) => {
    it(`Test case #${index + 1}: deadline=${moment(deadline * 1000).toISOString()}`, () => {
      const result = pipe.transform(deadline);
      expect(result.days).toBe(expectedDays);
      expect(result.passedDeadline).toBe(passed);
      expect(result.till).toBe(moment(deadline * 1000).format('DD.MM.YYYY'));
    });
  });
});
