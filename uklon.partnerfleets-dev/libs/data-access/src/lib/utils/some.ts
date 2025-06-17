export const some = <T = unknown>(obj: T, fn: (prop: unknown) => boolean): boolean => {
  return Object.keys(obj).some((key) => {
    const value = obj[key as keyof T];

    if (typeof value === 'object' && value !== null) {
      return some(value, fn);
    }

    return fn(value);
  });
};
