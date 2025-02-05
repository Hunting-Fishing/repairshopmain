import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface StaffSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export function StaffSearch({ searchTerm, onSearchChange }: StaffSearchProps) {
  return (
    <div className="relative flex-1">
      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Search staff members..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="pl-8"
      />
    </div>
  );
}