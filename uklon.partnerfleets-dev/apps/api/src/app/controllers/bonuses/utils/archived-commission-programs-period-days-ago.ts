import { DateRangeDto } from '@data-access';

export const archivedCommissionProgramsPeriodDaysAgo = (daysAgo = 30): DateRangeDto => {
  const now = Math.floor(Date.now() / 1000);
  const secondsInDay = 24 * 60 * 60;
  const dateFrom = now - daysAgo * secondsInDay;

  return { from: dateFrom, to: now };
};
