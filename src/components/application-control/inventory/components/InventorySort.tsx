import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type SortField = 'name' | 'quantity_in_stock' | 'unit_cost';
type SortOrder = 'asc' | 'desc';

interface InventorySortProps {
  sortField: SortField;
  sortOrder: SortOrder;
  onSort: (field: SortField) => void;
}

export function InventorySort({ sortField, sortOrder, onSort }: InventorySortProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          Sort by {sortField.replace('_', ' ')} <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => onSort('name')}>
          Name {sortField === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onSort('quantity_in_stock')}>
          Quantity {sortField === 'quantity_in_stock' && (sortOrder === 'asc' ? '↑' : '↓')}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onSort('unit_cost')}>
          Unit Cost {sortField === 'unit_cost' && (sortOrder === 'asc' ? '↑' : '↓')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}