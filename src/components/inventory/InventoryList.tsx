import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, PackageOpen } from "lucide-react";

interface InventoryListProps {
  searchQuery: string;
  filters: {
    lowStock?: boolean;
    outOfStock?: boolean;
    needsReorder?: boolean;
  };
}

export function InventoryList({ searchQuery, filters }: InventoryListProps) {
  const { data: items, isLoading, error } = useQuery({
    queryKey: ['inventory-items', searchQuery, filters],
    queryFn: async () => {
      let query = supabase
        .from('inventory_items')
        .select(`
          *,
          category:category_id(name),
          supplier:supplier_id(name)
        `);

      if (searchQuery) {
        query = query.ilike('name', `%${searchQuery}%`);
      }

      // Apply filters
      if (filters.lowStock) {
        query = query.lt('quantity_in_stock', 10);
      }
      if (filters.outOfStock) {
        query = query.eq('quantity_in_stock', 0);
      }
      if (filters.needsReorder) {
        query = query.lt('quantity_in_stock', 'reorder_point');
      }

      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching inventory items:', error);
        throw error;
      }
      
      return data;
    }
  });

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-10">
          <p className="text-center text-muted-foreground">Loading inventory items...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="py-10">
          <p className="text-center text-red-500">Error loading inventory items: {error.message}</p>
        </CardContent>
      </Card>
    );
  }

  if (!items || items.length === 0) {
    return (
      <Card>
        <CardContent className="py-10">
          <p className="text-center text-muted-foreground">No inventory items found</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <Card key={item.id} className="hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{item.name}</CardTitle>
              {item.quantity_in_stock === 0 && (
                <Badge variant="destructive" className="ml-2">
                  Out of Stock
                </Badge>
              )}
              {item.quantity_in_stock > 0 && item.quantity_in_stock <= (item.reorder_point || 5) && (
                <Badge variant="warning" className="ml-2">
                  Low Stock
                </Badge>
              )}
            </div>
            <CardDescription>SKU: {item.sku || 'N/A'}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Quantity</span>
                <span className="font-medium">{item.quantity_in_stock || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Category</span>
                <span>{item.category?.name || 'Uncategorized'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Supplier</span>
                <span>{item.supplier?.name || 'No supplier'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Price</span>
                <span className="font-medium">
                  ${item.selling_price?.toFixed(2) || '0.00'}
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
  );
}