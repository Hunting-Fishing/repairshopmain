import { useQuery } from "@tanstack/react-query";
import { List } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

export function InventoryCategories() {
  const { data: categories } = useQuery({
    queryKey: ['inventory-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('inventory_categories')
        .select('*')
        .throwOnError();
      return data || [];
    }
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <List className="h-5 w-5" />
          Categories
        </CardTitle>
        <CardDescription>Inventory category management</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {categories?.map(category => (
            <div key={category.id} className="flex items-center justify-between">
              <span>{category.name}</span>
              <span className="text-sm text-muted-foreground">{category.description}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}