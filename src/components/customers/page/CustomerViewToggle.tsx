
import { LayoutGrid, List } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface CustomerViewToggleProps {
  viewMode: "list" | "grid";
  onViewChange: (value: "list" | "grid") => void;
  isModernTheme?: boolean;
}

export function CustomerViewToggle({ 
  viewMode, 
  onViewChange,
  isModernTheme = false 
}: CustomerViewToggleProps) {
  return (
    <ToggleGroup 
      type="single" 
      value={viewMode} 
      onValueChange={(value) => value && onViewChange(value as "list" | "grid")} 
      className="bg-white/90 p-1 rounded-lg shadow-md"
    >
      <ToggleGroupItem 
        value="list" 
        aria-label="List View" 
        className={`data-[state=on]:${isModernTheme ? 'bg-blue-500' : 'bg-[#F97316]'} data-[state=on]:text-white`}
      >
        <List className="h-4 w-4" />
      </ToggleGroupItem>
      <ToggleGroupItem 
        value="grid" 
        aria-label="Grid View" 
        className={`data-[state=on]:${isModernTheme ? 'bg-blue-500' : 'bg-[#F97316]'} data-[state=on]:text-white`}
      >
        <LayoutGrid className="h-4 w-4" />
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
