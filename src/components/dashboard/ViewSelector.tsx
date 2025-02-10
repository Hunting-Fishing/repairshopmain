
import { memo, useMemo } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarIcon, LayoutGrid, List } from "lucide-react";

interface ViewSelectorProps {
  viewMode: "calendar" | "grid" | "list";
  onViewChange: (value: "calendar" | "grid" | "list") => void;
}

export const ViewSelector = memo(function ViewSelector({ 
  viewMode, 
  onViewChange 
}: ViewSelectorProps) {
  const viewOptions = useMemo(() => [
    { value: "calendar", label: "Calendar", icon: CalendarIcon },
    { value: "grid", label: "Grid", icon: LayoutGrid },
    { value: "list", label: "List", icon: List }
  ], []);

  return (
    <Tabs 
      value={viewMode} 
      onValueChange={(value) => onViewChange(value as "calendar" | "grid" | "list")}
      className="hidden md:block"
    >
      <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
        {viewOptions.map(({ value, label, icon: Icon }) => (
          <TabsTrigger 
            key={value} 
            value={value} 
            className="flex items-center gap-2"
          >
            <Icon className="h-4 w-4" />
            {label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
});
