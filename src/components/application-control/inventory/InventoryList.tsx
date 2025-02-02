import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Package, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

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

      // Add pagination
      const start = (currentPage - 1) * itemsPerPage;
      query = query.range(start, start + itemsPerPage - 1);

      const { data, error, count } = await query.throwOnError();
      if (error) throw error;
      
      return { items: data, total: count || 0 };
    }
  });

  const totalPages = itemsData ? Math.ceil(itemsData.total / itemsPerPage) : 0;

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
        <Card key={i} className="animate-pulse">
          <CardHeader className="h-[100px] bg-gray-100" />
          <CardContent className="space-y-2">
            <div className="h-4 bg-gray-100 rounded" />
            <div className="h-4 bg-gray-100 rounded w-3/4" />
          </CardContent>
        </Card>
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

  return (
    <div className="space-y-4">
      <div className="flex justify-end gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              Sort by {sortField.replace('_', ' ')} <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => handleSort('name')}>
              Name {sortField === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleSort('quantity_in_stock')}>
              Quantity {sortField === 'quantity_in_stock' && (sortOrder === 'asc' ? '↑' : '↓')}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleSort('unit_cost')}>
              Unit Cost {sortField === 'unit_cost' && (sortOrder === 'asc' ? '↑' : '↓')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {itemsData.items.map((item) => (
          <Card key={item.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{item.name}</CardTitle>
                {item.quantity_in_stock === 0 ? (
                  <Badge variant="destructive">Out of Stock</Badge>
                ) : item.quantity_in_stock <= (item.reorder_point || 5) ? (
                  <Badge variant="secondary">Low Stock</Badge>
                ) : null}
              </div>
              <CardDescription>SKU: {item.sku || 'N/A'}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Quantity</span>
                  <span className="font-medium">{item.quantity_in_stock || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Category</span>
                  <span>{item.category?.name || 'Uncategorized'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Supplier</span>
                  <span>{item.supplier?.name || 'No supplier'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Unit Cost</span>
                  <span className="font-medium">${item.unit_cost?.toFixed(2) || '0.00'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Total Value</span>
                  <span className="font-medium text-green-600">
                    ${((item.quantity_in_stock || 0) * (item.unit_cost || 0)).toFixed(2)}
                  </span>
                </div>
                {item.quantity_in_stock <= (item.reorder_point || 5) && (
                  <div className="mt-4 p-2 bg-yellow-50 text-yellow-800 rounded-md flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    <span className="text-sm">Reorder needed</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {totalPages > 1 && (
        <Pagination className="mt-4">
          <PaginationContent>
            {currentPage > 1 && (
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                />
              </PaginationItem>
            )}
            {[...Array(totalPages)].map((_, i) => (
              <PaginationItem key={i + 1}>
                <PaginationLink
                  onClick={() => setCurrentPage(i + 1)}
                  isActive={currentPage === i + 1}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            {currentPage < totalPages && (
              <PaginationItem>
                <PaginationNext
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                />
              </PaginationItem>
            )}
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}