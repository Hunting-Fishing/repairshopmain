
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, StarIcon, Clock, Users } from "lucide-react";

export function TechnicianTabsList() {
  return (
    <TabsList className="grid w-full grid-cols-4 lg:w-[600px]">
      <TabsTrigger value="settings" className="flex items-center gap-2">
        <Settings className="h-4 w-4" />
        Settings
      </TabsTrigger>
      <TabsTrigger value="specialties" className="flex items-center gap-2">
        <StarIcon className="h-4 w-4" />
        Specialties
      </TabsTrigger>
      <TabsTrigger value="availability" className="flex items-center gap-2">
        <Clock className="h-4 w-4" />
        Availability
      </TabsTrigger>
      <TabsTrigger value="roles" className="flex items-center gap-2">
        <Users className="h-4 w-4" />
        Roles
      </TabsTrigger>
    </TabsList>
  );
}
