import { Search, ArrowUpDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SupplierListHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  sortOrder: 'asc' | 'desc';
  setSortOrder: (order: 'asc' | 'desc') => void;
  totalSuppliers: number;
}

export function SupplierListHeader({ 
  searchQuery, 
  setSearchQuery, 
  sortOrder, 
  setSortOrder,
  totalSuppliers 
}: SupplierListHeaderProps) {
  return (
    <>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search suppliers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
          className="flex items-center gap-2"
        >
          <ArrowUpDown className="h-4 w-4" />
          Sort {sortOrder === 'asc' ? 'A-Z' : 'Z-A'}
        </Button>
      </div>

      <div className="text-sm text-muted-foreground">
        Viewing {totalSuppliers} suppliers
      </div>
    </>
  );
}