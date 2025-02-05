import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Tool, Calendar } from "lucide-react";

export function TechnicianTabsList() {
  return (
    <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
      <TabsTrigger value="settings" className="flex items-center gap-2">
        <Settings className="h-4 w-4" />
        Settings
      </TabsTrigger>
      <TabsTrigger value="specialties" className="flex items-center gap-2">
        <Tool className="h-4 w-4" />
        Specialties
      </TabsTrigger>
      <TabsTrigger value="availability" className="flex items-center gap-2">
        <Calendar className="h-4 w-4" />
        Availability
      </TabsTrigger>
    </TabsList>
  );
}