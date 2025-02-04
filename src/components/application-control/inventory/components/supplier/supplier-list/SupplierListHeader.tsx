import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SupplierListHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  totalSuppliers: number;
  filteredCount: number;
}

export function SupplierListHeader({ 
  searchQuery, 
  setSearchQuery, 
  totalSuppliers,
  filteredCount 
}: SupplierListHeaderProps) {
  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Search suppliers by name, contact person, or email..." 
          className="pl-10 h-12"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      <div className="text-sm text-muted-foreground">
        Viewing {filteredCount} of {totalSuppliers} suppliers
        {searchQuery && ` (filtered from ${totalSuppliers} total)`}
      </div>
    </div>
  );
}