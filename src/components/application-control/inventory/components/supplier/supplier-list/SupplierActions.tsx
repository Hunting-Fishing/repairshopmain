import { Filter, ArrowUpDown, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AddSupplierDialog } from "../AddSupplierDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { InventorySupplier } from "../../../types";

interface SupplierActionsProps {
  onFilterChange: (status: string | null) => void;
  onSortChange: (field: keyof InventorySupplier) => void;
}

export function SupplierActions({ onFilterChange, onSortChange }: SupplierActionsProps) {
  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={() => onFilterChange(null)}>
              All
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onFilterChange("active")}>
              Active
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onFilterChange("inactive")}>
              Inactive
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            <ArrowUpDown className="h-4 w-4 mr-2" />
            Sort
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>Sort by</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={() => onSortChange("name")}>
              Name
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onSortChange("total_spent")}>
              Total Spent
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onSortChange("reliability_score")}>
              Reliability Score
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <Button variant="outline" size="sm">
        <Download className="h-4 w-4 mr-2" />
        Export
      </Button>
      <AddSupplierDialog />
    </div>
  );
}