import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { InventoryCard } from "./components/InventoryCard";
import { InventorySort } from "./components/InventorySort";
import { InventoryPagination } from "./components/InventoryPagination";

interface InventoryListProps {
  searchQuery: string;
  filters: {
    lowStock?: boolean;
    outOfStock?: boolean;
    needsReorder?: boolean;
  };
}

type SortField = 'name' | 'quantity_in_stock' | 'unit_cost';
type SortOrder = 'asc' | 'desc';

export function InventoryList({ searchQuery, filters }: InventoryListProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const itemsPerPage = 9;

  const { data: itemsData, isLoading, error } = useQuery({
    queryKey: ['inventory-items', searchQuery, filters, currentPage, sortField, sortOrder],
    queryFn: async () => {
      let query = supabase
        .from('inventory_items')
        .select(`
          *,
          category:category_id(name),
          supplier:supplier_id(name)
        `)
        .order(sortField, { ascending: sortOrder === 'asc' });

      if (searchQuery) {
        query = query.ilike('name', `%${searchQuery}%`);
      }

      if (filters.lowStock) {
        query = query.lt('quantity_in_stock', 10);
      }
      if (filters.outOfStock) {
        query = query.eq('quantity_in_stock', 0);
      }
      if (filters.needsReorder) {
        query = query.lt('quantity_in_stock', 'reorder_point');
      }

      const start = (currentPage - 1) * itemsPerPage;
      query = query.range(start, start + itemsPerPage - 1);

      const { data, error, count } = await query.throwOnError();
      if (error) throw error;
      
      return { items: data, total: count || 0 };
    }
  });

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  if (isLoading) return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="h-[200px] bg-gray-100 rounded-lg" />
        </div>
      ))}
    </div>
  );

  if (error) return (
    <div className="text-center text-red-500 py-8">
      Error loading inventory: {error.message}
    </div>
  );

  if (!itemsData?.items?.length) return (
    <div className="text-center py-8">No items found</div>
  );

  const totalPages = Math.ceil(itemsData.total / itemsPerPage);

  return (
    <div className="space-y-4">
      <div className="flex justify-end gap-2">
        <InventorySort
          sortField={sortField}
          sortOrder={sortOrder}
          onSort={handleSort}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {itemsData.items.map((item) => (
          <InventoryCard key={item.id} item={item} />
        ))}
      </div>

      <InventoryPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}