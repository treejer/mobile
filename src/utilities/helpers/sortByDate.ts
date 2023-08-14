export function sortByDate<T>(array: T[], comparison: string): T[] {
  return array.sort((a, b) => new Date(b[comparison]).getTime() - new Date(a[comparison]).getTime());
}
