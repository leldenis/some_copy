export const normalizeString = (value: string): string => {
  if (!value) {
    return '';
  }

  return value.toLowerCase().replace(/\s+/g, '');
};
