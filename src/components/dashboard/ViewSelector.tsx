import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarIcon, LayoutGrid, List } from "lucide-react";

interface ViewSelectorProps {
  viewMode: "calendar" | "grid" | "list";
  onViewChange: (value: "calendar" | "grid" | "list") => void;
}

export function ViewSelector({ viewMode, onViewChange }: ViewSelectorProps) {
  return (
    <Tabs 
      value={viewMode} 
      onValueChange={(value) => onViewChange(value as "calendar" | "grid" | "list")}
      className="hidden md:block"
    >
      <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
        <TabsTrigger value="calendar" className="flex items-center gap-2">
          <CalendarIcon className="h-4 w-4" />
          Calendar
        </TabsTrigger>
        <TabsTrigger value="grid" className="flex items-center gap-2">
          <LayoutGrid className="h-4 w-4" />
          Grid
        </TabsTrigger>
        <TabsTrigger value="list" className="flex items-center gap-2">
          <List className="h-4 w-4" />
          List
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}