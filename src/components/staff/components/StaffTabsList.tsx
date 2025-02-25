
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Shield, Settings2, GitBranch, Calendar, LineChart, History } from "lucide-react";

export function StaffTabsList() {
  return (
    <TabsList className="bg-muted/50 p-1">
      <TabsTrigger value="staff" className="flex items-center gap-2 data-[state=active]:bg-background">
        <Users className="h-4 w-4" />
        Staff Members
      </TabsTrigger>
      <TabsTrigger value="roles" className="flex items-center gap-2 data-[state=active]:bg-background">
        <Shield className="h-4 w-4" />
        Roles
      </TabsTrigger>
      <TabsTrigger value="settings" className="flex items-center gap-2 data-[state=active]:bg-background">
        <Settings2 className="h-4 w-4" />
        Settings
      </TabsTrigger>
      <TabsTrigger value="scheduling" className="flex items-center gap-2 data-[state=active]:bg-background">
        <Calendar className="h-4 w-4" />
        Scheduling
      </TabsTrigger>
      <TabsTrigger value="assignment-rules" className="flex items-center gap-2 data-[state=active]:bg-background">
        <GitBranch className="h-4 w-4" />
        Assignment Rules
      </TabsTrigger>
      <TabsTrigger value="time-off" className="flex items-center gap-2 data-[state=active]:bg-background">
        <Calendar className="h-4 w-4" />
        Time Off
      </TabsTrigger>
      <TabsTrigger value="performance" className="flex items-center gap-2 data-[state=active]:bg-background">
        <LineChart className="h-4 w-4" />
        Performance
      </TabsTrigger>
      <TabsTrigger value="history" className="flex items-center gap-2 data-[state=active]:bg-background">
        <History className="h-4 w-4" />
        History
      </TabsTrigger>
    </TabsList>
  );
}
