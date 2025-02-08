
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Box, Minus, Plus, Eye } from "lucide-react";
import type { InventoryItem } from "../../types";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { InventoryItemDetails } from "../item-details/InventoryItemDetails";

interface InventoryListProps {
  items: InventoryItem[];
}

export function InventoryList({ items }: InventoryListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const { toast } = useToast();

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const updateInventoryLevels = async (itemId: string, reorderPoint: number, reorderQuantity: number) => {
    const { error } = await supabase
      .from('inventory_items')
      .update({
        reorder_point: reorderPoint,
        reorder_quantity: reorderQuantity
      })
      .eq('id', itemId);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error updating inventory levels",
        description: error.message
      });
    } else {
      toast({
        title: "Inventory levels updated",
        description: "The minimum and maximum levels have been updated successfully."
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Input
          placeholder="Search inventory items..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredItems.map((item) => (
          <Card key={item.id} className="relative">
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg">{item.name}</CardTitle>
                <div className="flex items-center gap-2">
                  <Badge variant={item.quantity_in_stock <= (item.reorder_point || 0) ? "destructive" : "secondary"}>
                    {item.quantity_in_stock} in stock
                  </Badge>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSelectedItem(item)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-1">
                    <Minus className="h-4 w-4" />
                    Minimum Level
                  </span>
                  <span>{item.reorder_point || 0}</span>
                </div>
                <Slider
                  defaultValue={[item.reorder_point || 0]}
                  max={100}
                  step={1}
                  onValueChange={(value) => {
                    if (item.id) {
                      updateInventoryLevels(item.id, value[0], item.reorder_quantity || 0);
                    }
                  }}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-1">
                    <Plus className="h-4 w-4" />
                    Maximum Level
                  </span>
                  <span>{item.reorder_quantity || 0}</span>
                </div>
                <Slider
                  defaultValue={[item.reorder_quantity || 0]}
                  max={200}
                  step={1}
                  onValueChange={(value) => {
                    if (item.id) {
                      updateInventoryLevels(item.id, item.reorder_point || 0, value[0]);
                    }
                  }}
                />
              </div>

              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Box className="h-4 w-4" />
                  Current Stock Level
                </span>
                <span className="font-medium text-foreground">{item.quantity_in_stock}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <InventoryItemDetails
        item={selectedItem}
        open={!!selectedItem}
        onOpenChange={(open) => !open && setSelectedItem(null)}
      />
    </div>
  );
}
