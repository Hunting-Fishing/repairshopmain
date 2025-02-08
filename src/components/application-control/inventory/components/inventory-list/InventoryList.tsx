
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Download, Filter, Plus, RefreshCw } from "lucide-react";
import type { InventoryItem } from "../../types";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { InventoryItemDetails } from "../item-details/InventoryItemDetails";

interface InventoryListProps {
  items: (InventoryItem & {
    category?: {
      name: string;
    } | null;
  })[];
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

  const getStatusColor = (status: string) => {
    const colors = {
      needs_attention: "bg-orange-500 hover:bg-orange-600",
      active: "bg-blue-500 hover:bg-blue-600",
      processed: "bg-green-500 hover:bg-green-600",
    };
    return colors[status as keyof typeof colors] || "bg-gray-500 hover:bg-gray-600";
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      needs_attention: "Waiting for parts",
      active: "In work",
      processed: "Done",
    };
    return labels[status as keyof typeof labels] || status;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4 mb-6">
        <div className="flex-1 flex items-center gap-4">
          <Button className="gap-2 bg-green-500 hover:bg-green-600">
            <Plus className="h-4 w-4" />
            Order
          </Button>
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
          <Input
            placeholder="Search orders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-xs"
          />
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-lg">
            <span className="font-medium">{items.length}</span>
            <span>orders</span>
          </div>
          <div className="flex items-center gap-2 bg-red-100 text-red-800 px-4 py-2 rounded-lg">
            <span className="font-medium">
              {items.filter(item => item.status === 'needs_attention').length}
            </span>
            <span>urgent</span>
          </div>
          <div className="flex items-center gap-2 bg-orange-100 text-orange-800 px-4 py-2 rounded-lg">
            <span className="font-medium">
              {items.filter(item => item.quantity_in_stock <= (item.reorder_point || 5)).length}
            </span>
            <span>low stock</span>
          </div>
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
                <th className="p-4 text-left">Order #</th>
                <th className="p-4 text-left">Due Date</th>
                <th className="p-4 text-left">Status</th>
                <th className="p-4 text-left">Item</th>
                <th className="p-4 text-left">Category</th>
                <th className="p-4 text-left">Client</th>
                <th className="p-4 text-left">Specialist</th>
                <th className="p-4 text-right">Price</th>
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
                  <td className="p-4 font-medium">{item.id.slice(0, 8)}</td>
                  <td className="p-4">{format(new Date(item.created_at), 'MMM d, yyyy')}</td>
                  <td className="p-4">
                    <Select defaultValue={item.status}>
                      <SelectTrigger className={`w-[140px] text-white ${getStatusColor(item.status)}`}>
                        <SelectValue>{getStatusLabel(item.status)}</SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="needs_attention">Waiting for parts</SelectItem>
                        <SelectItem value="active">In work</SelectItem>
                        <SelectItem value="processed">Done</SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="p-4">
                    <div>
                      <div className="font-medium">{item.name}</div>
                      <div className="text-sm text-muted-foreground">{item.sku}</div>
                    </div>
                  </td>
                  <td className="p-4">{item.category?.name || 'Uncategorized'}</td>
                  <td className="p-4">
                    <div className="font-medium">Customer Name</div>
                    <div className="text-sm text-muted-foreground">ID: {item.created_by}</div>
                  </td>
                  <td className="p-4">Assigned Staff</td>
                  <td className="p-4 text-right">${item.unit_cost?.toFixed(2) || '0.00'}</td>
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
