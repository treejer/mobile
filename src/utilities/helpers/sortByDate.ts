export function sortByDate(array: any[], comparison: string) {
  return array.sort((a, b) => new Date(b[comparison]).getTime() - new Date(a[comparison]).getTime());
}
