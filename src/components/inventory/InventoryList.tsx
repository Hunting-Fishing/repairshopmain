import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface InventoryListProps {
  searchQuery: string;
  filters: any;
}

export function InventoryList({ searchQuery, filters }: InventoryListProps) {
  const { data: items, isLoading, error } = useQuery({
    queryKey: ['inventory-items', searchQuery, filters],
    queryFn: async () => {
      let query = supabase
        .from('inventory_items')
        .select('*, category:category_id(name), supplier:supplier_id(name)');

      if (searchQuery) {
        query = query.ilike('name', `%${searchQuery}%`);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      return data || [];
    }
  });

  if (isLoading) {
    return <div>Loading inventory items...</div>;
  }

  if (error) {
    return <div>Error loading inventory items: {error.message}</div>;
  }

  if (!items?.length) {
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
            <CardTitle>{item.name}</CardTitle>
            <CardDescription>SKU: {item.sku}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Quantity</span>
                <span className="font-medium">{item.quantity_in_stock}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Category</span>
                <span>{item.category?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Supplier</span>
                <span>{item.supplier?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Price</span>
                <span className="font-medium">
                  ${item.selling_price?.toFixed(2)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}