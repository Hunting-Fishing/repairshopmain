import { Filter } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface InventoryFiltersProps {
  onFilterChange: (filters: {
    lowStock?: boolean;
    outOfStock?: boolean;
    needsReorder?: boolean;
  }) => void;
}

export function InventoryFilters({ onFilterChange }: InventoryFiltersProps) {
  const [filters, setFilters] = useState({
    lowStock: false,
    outOfStock: false,
    needsReorder: false,
  });

  const handleFilterChange = (key: keyof typeof filters) => {
    const newFilters = {
      ...filters,
      [key]: !filters[key],
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Filter By</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem
          checked={filters.lowStock}
          onCheckedChange={() => handleFilterChange('lowStock')}
        >
          Low Stock
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={filters.outOfStock}
          onCheckedChange={() => handleFilterChange('outOfStock')}
        >
          Out of Stock
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={filters.needsReorder}
          onCheckedChange={() => handleFilterChange('needsReorder')}
        >
          Needs Reorder
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}