
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface CustomerSearchBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  isModernTheme?: boolean;
}

export function CustomerSearchBar({ 
  searchQuery, 
  onSearchChange,
  isModernTheme = false 
}: CustomerSearchBarProps) {
  return (
    <div className="relative flex-1 max-w-sm">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
      <Input
        placeholder="Search customers..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        className={`pl-10 ${
          isModernTheme 
            ? 'bg-white/90 hover:bg-white focus:bg-white transition-colors border-transparent focus:border-blue-500'
            : 'bg-white/90 hover:bg-white focus:bg-white transition-colors border-transparent focus:border-[#F97316]'
        } shadow-md`}
      />
    </div>
  );
}
