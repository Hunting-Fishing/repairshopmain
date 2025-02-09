
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Filter, Plus } from "lucide-react";

interface InventoryListHeaderProps {
  onAddItem: () => void;
}

export function InventoryListHeader({ onAddItem }: InventoryListHeaderProps) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex-1 flex items-center gap-4">
        <Button className="gap-2 bg-green-500 hover:bg-green-600" onClick={onAddItem}>
          <Plus className="h-4 w-4" />
          New Item
        </Button>
        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" />
          Filter
        </Button>
        <Input
          placeholder="Search items..."
          className="max-w-xs"
        />
      </div>
    </div>
  );
}
