
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Download, RefreshCw } from "lucide-react";
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
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const { toast } = useToast();

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectAll = (checked: boolean) => {
    setSelectedItems(checked ? filteredItems.map(item => item.id) : []);
  };

  const handleSelectItem = (itemId: string, checked: boolean) => {
    setSelectedItems(prev =>
      checked ? [...prev, itemId] : prev.filter(id => id !== itemId)
    );
  };

  const handleProcess = async (itemId: string) => {
    const { error } = await supabase
      .from('inventory_items')
      .update({ status: 'processed' })
      .eq('id', itemId);

    if (error) {
      toast({
        title: "Error processing item",
        description: error.message,
        variant: "destructive"
      });
    } else {
      toast({
        title: "Item processed successfully",
        description: "The inventory item has been marked as processed."
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center gap-4 mb-6">
        <Input
          placeholder="Search by order, customer, SKU..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-md"
        />
        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-[160px] justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {startDate ? format(startDate, "PPP") : "Start Date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={setStartDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-[160px] justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {endDate ? format(endDate, "PPP") : "End Date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={endDate}
                onSelect={setEndDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <Button variant="secondary" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button variant="secondary" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Sync Orders
          </Button>
        </div>
      </div>

      <Card>
        <div className="rounded-md border">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="p-4 text-left">
                  <Checkbox
                    checked={selectedItems.length === filteredItems.length}
                    onCheckedChange={handleSelectAll}
                  />
                </th>
                <th className="p-4 text-left">Actions</th>
                <th className="p-4 text-left">Status</th>
                <th className="p-4 text-left">Date</th>
                <th className="p-4 text-left">SKU</th>
                <th className="p-4 text-left">Order #</th>
                <th className="p-4 text-left">Name</th>
                <th className="p-4 text-right">Price</th>
                <th className="p-4 text-right">Quantity</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item) => (
                <tr key={item.id} className="border-b">
                  <td className="p-4">
                    <Checkbox
                      checked={selectedItems.includes(item.id)}
                      onCheckedChange={(checked) => handleSelectItem(item.id, checked as boolean)}
                    />
                  </td>
                  <td className="p-4">
                    <Button
                      variant={item.status === 'needs_attention' ? 'destructive' : 'secondary'}
                      size="sm"
                      onClick={() => handleProcess(item.id)}
                    >
                      {item.status === 'needs_attention' ? 'Resolve' : 'Process'}
                    </Button>
                  </td>
                  <td className="p-4">
                    <Badge variant={item.status === 'needs_attention' ? 'destructive' : 'secondary'}>
                      {item.status || 'PROCESSED'}
                    </Badge>
                  </td>
                  <td className="p-4">{format(new Date(item.created_at), 'M/d/yy')}</td>
                  <td className="p-4">{item.sku || '-'}</td>
                  <td className="p-4">{item.id.slice(0, 8)}</td>
                  <td className="p-4">{item.name}</td>
                  <td className="p-4 text-right">${item.unit_cost?.toFixed(2) || '0.00'}</td>
                  <td className="p-4 text-right">{item.quantity_in_stock || 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <InventoryItemDetails
        item={selectedItem}
        open={!!selectedItem}
        onOpenChange={(open) => !open && setSelectedItem(null)}
      />
    </div>
  );
}
