export function isFilterSelected(filters: string[], option: string) {
  return filters.includes(option) || (filters.length === 0 && option === 'all');
}
