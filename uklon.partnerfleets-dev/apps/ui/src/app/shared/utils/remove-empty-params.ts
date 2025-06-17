import _, { isNil } from 'lodash';

export function removeEmptyParams<T extends object>(params: T): Partial<T> {
  const copy = structuredClone(params);
  return _.omitBy(copy, (value) => isNil(value) || value === '') as Partial<T>;
}
