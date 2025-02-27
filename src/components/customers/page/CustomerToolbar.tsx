
import { memo, useMemo } from "react";
import { Search, Filter, Download } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CustomerToolbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onFilterChange: (filter: string) => void;
  filterValue?: string;
  onExport?: () => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  isModernTheme?: boolean;
}

// Memoize filter options to prevent recreation
const filterOptions = [
  { value: "all", label: "All Customers" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "pending", label: "Pending" },
  { value: "high_value", label: "High Value" },
  { value: "at_risk", label: "At Risk" },
];

export const CustomerToolbar = memo(function CustomerToolbar({
  searchQuery,
  onSearchChange,
  onFilterChange,
  filterValue = "all",
  onExport,
  isModernTheme = false,
}: CustomerToolbarProps) {

  // Memoize the filter style for modern theme
  const filterStyle = useMemo(() => 
    isModernTheme 
      ? 'bg-white border border-gray-200 hover:border-blue-300 focus:border-blue-400 transition-colors'
      : '',
    [isModernTheme]
  );

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search customers..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className={`pl-10 ${
            isModernTheme
              ? 'bg-white border border-gray-200 focus:border-blue-400 transition-colors'
              : ''
          }`}
        />
      </div>

      <div className="flex gap-3">
        <div className="w-[200px]">
          <Select 
            value={filterValue} 
            onValueChange={onFilterChange}
          >
            <SelectTrigger className={filterStyle}>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <span>Filter</span>
              </div>
            </SelectTrigger>
            <SelectContent>
              {filterOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {onExport && (
          <Button variant="outline" onClick={onExport}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        )}
      </div>
    </div>
  );
});
