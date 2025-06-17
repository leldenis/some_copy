import { endOfDay, startOfDay } from 'date-fns';

function toUNIX(milliseconds: number): number {
  return Math.round(milliseconds / 1000);
}

export const getMonday = (): number => {
  const currentDate = new Date();
  const day = currentDate.getDay();
  const diff = currentDate.getDate() - day + (day === 0 ? -6 : 1);
  return +new Date(currentDate.setDate(diff));
};

export const getSunday = (): number => {
  const monday = new Date(getMonday());
  return +new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + 6);
};

export const getToday = (): { from: number; to: number } => {
  const currentDate = new Date();
  return {
    from: +startOfDay(currentDate),
    to: +endOfDay(currentDate),
  };
};

export const getYesterday = (): { from: number; to: number } => {
  const currentDate = new Date();
  const yesterday = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - 1);
  return {
    from: +startOfDay(yesterday),
    to: +endOfDay(yesterday),
  };
};

export const getCurrentWeek = (toUnix = false): { from: number; to: number } => {
  const from = toUnix ? toUNIX(+startOfDay(getMonday())) : +startOfDay(getMonday());
  const to = toUnix ? toUNIX(+endOfDay(getSunday())) : +endOfDay(getSunday());

  return { from, to };
};

export const getLastWeek = (): { from: number; to: number } => {
  const currentMonday = new Date(getMonday());
  return {
    from: +startOfDay(new Date(currentMonday.getFullYear(), currentMonday.getMonth(), currentMonday.getDate() - 7)),
    to: +endOfDay(new Date(currentMonday.getFullYear(), currentMonday.getMonth(), currentMonday.getDate() - 1)),
  };
};

export const getCurrentMonth = (): { from: number; to: number } => {
  const today = new Date();
  return {
    from: +startOfDay(new Date(today.getFullYear(), today.getMonth(), 1)),
    to: +endOfDay(today),
  };
};

export const getLastMonth = (): { from: number; to: number } => {
  const today = new Date();
  return {
    from: +startOfDay(new Date(today.getFullYear(), today.getMonth() - 1, 1)),
    to: +endOfDay(new Date(today.getFullYear(), today.getMonth(), 0)),
  };
};

// eslint-disable-next-line complexity
const setQuarter = (quarter: number, isLastYear = false): { from: number; to: number } => {
  const today = new Date();
  switch (quarter) {
    case 1:
      return {
        from: +startOfDay(new Date(isLastYear ? today.getFullYear() - 1 : today.getFullYear(), 0, 1)),
        to: +endOfDay(new Date(isLastYear ? today.getFullYear() - 1 : today.getFullYear(), 3, 0)),
      };
    case 2:
      return {
        from: +startOfDay(new Date(isLastYear ? today.getFullYear() - 1 : today.getFullYear(), 3, 1)),
        to: +endOfDay(new Date(isLastYear ? today.getFullYear() - 1 : today.getFullYear(), 6, 0)),
      };
    case 3:
      return {
        from: +startOfDay(new Date(isLastYear ? today.getFullYear() - 1 : today.getFullYear(), 6, 1)),
        to: +endOfDay(new Date(isLastYear ? today.getFullYear() - 1 : today.getFullYear(), 9, 0)),
      };
    case 4:
      return {
        from: +startOfDay(new Date(isLastYear ? today.getFullYear() - 1 : today.getFullYear(), 9, 1)),
        to: +endOfDay(new Date(isLastYear ? today.getFullYear() - 1 : today.getFullYear(), 12, 0)),
      };
    default:
      return null;
  }
};

export const getCurrentQuarter = (): { from: number; to: number } => {
  const today = new Date();
  const currentMonth = today.getMonth();

  if (currentMonth <= 2) {
    return setQuarter(1);
  }
  if (currentMonth <= 5) {
    return setQuarter(2);
  }
  if (currentMonth <= 8) {
    return setQuarter(3);
  }
  return setQuarter(4);
};

export const getLastQuarter = (): { from: number; to: number } => {
  const today = new Date();
  const currentMonth = today.getMonth();
  let previousQuarterMonth;
  let isLastYear = false;
  if (currentMonth >= 3) {
    previousQuarterMonth = currentMonth - 3;
  } else {
    previousQuarterMonth = Math.abs(11 - currentMonth);
    isLastYear = true;
  }

  if (previousQuarterMonth <= 2) {
    return setQuarter(1, isLastYear);
  }
  if (previousQuarterMonth <= 5) {
    return setQuarter(2, isLastYear);
  }
  if (previousQuarterMonth <= 8) {
    return setQuarter(3, isLastYear);
  }
  return setQuarter(4, isLastYear);
};

export const dateToRange = (date: number): { from: number; to: number } => {
  return {
    from: startOfDay(date * 1000).getTime(),
    to: endOfDay(date * 1000).getTime(),
  };
};
