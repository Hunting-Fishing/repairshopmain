
import { memo } from "react";
import { DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CustomerViewToggle } from "./CustomerViewToggle";
import { ViewMode } from "../hooks/useViewMode";

interface CustomerControlsProps {
  viewMode: ViewMode;
  onViewChange: (view: ViewMode) => void;
  onAddClick: () => void;
  isModernTheme: boolean;
}

// Memoized component to prevent unnecessary re-renders
export const CustomerControls = memo(function CustomerControls({
  viewMode,
  onViewChange,
  onAddClick,
  isModernTheme
}: CustomerControlsProps) {
  return (
    <div className="flex items-center justify-between mb-4">
      <CustomerViewToggle 
        viewMode={viewMode}
        onViewChange={onViewChange}
        isModernTheme={isModernTheme}
      />
      
      <DialogTrigger asChild>
        <Button 
          className={`${
            isModernTheme
              ? 'bg-blue-500 hover:bg-blue-600'
              : 'bg-[#F97316] hover:bg-[#EA580C]'
          } transition-colors shadow-md hover:shadow-lg`}
          size="lg"
          onClick={onAddClick}
        >
          <Plus className="mr-2 h-5 w-5" />
          Add Customer
        </Button>
      </DialogTrigger>
    </div>
  );
});
