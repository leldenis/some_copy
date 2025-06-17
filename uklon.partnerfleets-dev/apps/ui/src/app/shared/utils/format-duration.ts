import { DurationDate } from '@ui/shared';

export const transformFormatDuration = (value: number): DurationDate => {
  const hours = Math.floor(value / 60 / 60);
  const minutes = Math.ceil(value / 60) % 60;
  const result: DurationDate = {
    minutes: minutes < 10 ? `0${minutes}` : `${minutes}`,
  };
  if (hours) {
    result.hours = hours < 10 ? `0${hours}` : `${hours}`;
  }
  return result;
};
