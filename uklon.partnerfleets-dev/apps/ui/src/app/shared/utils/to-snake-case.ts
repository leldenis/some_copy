export function toSnakeCase(str: string): string {
  return str
    .replace(/-/g, '_')
    .replace(/([\da-z])([A-Z])/g, '$1_$2')
    .replace(/\s+/g, '_')
    .toLowerCase();
}
