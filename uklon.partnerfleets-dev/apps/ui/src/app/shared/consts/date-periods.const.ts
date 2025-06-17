import {
  getCurrentMonth,
  getCurrentQuarter,
  getCurrentWeek,
  getLastMonth,
  getLastQuarter,
  getLastWeek,
  getToday,
  getYesterday,
} from '@data-access';
import { PeriodLabel } from '@ui/shared/enums';

interface ValuePickerOption<T = unknown> {
  label: string;
  values: T;
  analyticsLabel?: string;
  cyLabel?: string;
}

interface DatePeriodFilterValue {
  from: number | null;
  to: number | null;
  isCustom?: boolean;
}

export const DATE_PERIODS: ValuePickerOption<DatePeriodFilterValue>[] = [
  {
    label: PeriodLabel.TODAY,
    values: getToday(),
    analyticsLabel: 'Today',
    cyLabel: 'today',
  },
  {
    label: PeriodLabel.YESTERDAY,
    values: getYesterday(),
    analyticsLabel: 'Yesterday',
    cyLabel: 'yesterday',
  },
  {
    label: PeriodLabel.CURRENT_WEEK,
    values: getCurrentWeek(),
    analyticsLabel: 'Current week',
    cyLabel: 'current-week',
  },
  {
    label: PeriodLabel.LAST_WEEK,
    values: getLastWeek(),
    analyticsLabel: 'Last week',
    cyLabel: 'last-week',
  },
  {
    label: PeriodLabel.CURRENT_MONTH,
    values: getCurrentMonth(),
    analyticsLabel: 'Current month',
    cyLabel: 'current-month',
  },
  {
    label: PeriodLabel.LAST_MONTH,
    values: getLastMonth(),
    analyticsLabel: 'Last month',
    cyLabel: 'last-month',
  },
  {
    label: PeriodLabel.CURRENT_QUARTER,
    values: getCurrentQuarter(),
    analyticsLabel: 'Current quarter',
    cyLabel: 'current-quarter',
  },
  {
    label: PeriodLabel.LAST_QUARTER,
    values: getLastQuarter(),
    analyticsLabel: 'Last quarter',
    cyLabel: 'last-quarter',
  },
  {
    label: PeriodLabel.CHOOSE_PERIOD,
    values: {
      from: null,
      to: null,
      isCustom: true,
    },
  },
];
