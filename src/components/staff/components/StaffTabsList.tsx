
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Settings, UserCog } from "lucide-react";

export function StaffTabsList() {
  return (
    <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
      <TabsTrigger value="staff" className="flex items-center gap-2">
        <Users className="h-4 w-4" />
        Staff
      </TabsTrigger>
      <TabsTrigger value="roles" className="flex items-center gap-2">
        <UserCog className="h-4 w-4" />
        Roles
      </TabsTrigger>
      <TabsTrigger value="settings" className="flex items-center gap-2">
        <Settings className="h-4 w-4" />
        Settings
      </TabsTrigger>
    </TabsList>
  );
}
