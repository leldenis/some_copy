export function hasNextBatch(cursor: number | string | undefined): boolean {
  return !String(cursor)?.startsWith('0');
}
