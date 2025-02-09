
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ListTree, Users, Settings, List, History, BarChart3 } from "lucide-react";

export function TabList() {
  return (
    <TabsList>
      <TabsTrigger value="overview" className="flex items-center gap-2">
        <BarChart3 className="h-4 w-4" />
        Overview
      </TabsTrigger>
      <TabsTrigger value="inventory" className="flex items-center gap-2">
        <List className="h-4 w-4" />
        Inventory
      </TabsTrigger>
      <TabsTrigger value="categories" className="flex items-center gap-2">
        <ListTree className="h-4 w-4" />
        Categories
      </TabsTrigger>
      <TabsTrigger value="suppliers" className="flex items-center gap-2">
        <Users className="h-4 w-4" />
        Suppliers
      </TabsTrigger>
      <TabsTrigger value="history" className="flex items-center gap-2">
        <History className="h-4 w-4" />
        History
      </TabsTrigger>
      <TabsTrigger value="settings" className="flex items-center gap-2">
        <Settings className="h-4 w-4" />
        Settings
      </TabsTrigger>
    </TabsList>
  );
}
