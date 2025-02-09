
export function useInventorySort(query: any, sortField: string, sortOrder: 'asc' | 'desc') {
  return query.order(sortField, { ascending: sortOrder === 'asc' });
}
