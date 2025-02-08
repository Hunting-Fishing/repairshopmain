
import { TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ListTree, Users, Settings, List, History, BarChart3 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { InventoryOverview } from "../InventoryOverview";
import { InventoryList } from "../components/inventory-list/InventoryList";
import { InventoryCategories } from "../InventoryCategories";
import { InventorySuppliers } from "../InventorySuppliers";
import { InventoryHistory } from "../components/history/InventoryHistory";
import { InventorySettings } from "../components/settings/InventorySettings";
import type { InventoryCategory, InventoryItem, InventorySupplier } from "../types";

interface TabContentProps {
  categories: InventoryCategory[];
  items: InventoryItem[];
  suppliers: InventorySupplier[];
}

function Loading() {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-[120px] w-full rounded-lg" />
          ))}
        </div>
        <Skeleton className="h-[300px] w-full rounded-lg" />
      </div>
    </div>
  );
}

function List() {
  return (
    <TabsList className="w-full grid grid-cols-6 lg:w-[900px]">
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

function Content({ categories, items, suppliers }: TabContentProps) {
  return (
    <>
      <TabsContent value="overview" className="mt-4">
        <InventoryOverview />
      </TabsContent>

      <TabsContent value="inventory" className="mt-4">
        <InventoryList items={items} />
      </TabsContent>
      
      <TabsContent value="categories" className="mt-4">
        <InventoryCategories categories={categories} />
      </TabsContent>
      
      <TabsContent value="suppliers" className="mt-4">
        <InventorySuppliers suppliers={suppliers} />
      </TabsContent>

      <TabsContent value="history" className="mt-4">
        <InventoryHistory />
      </TabsContent>
      
      <TabsContent value="settings" className="mt-4">
        <InventorySettings />
      </TabsContent>
    </>
  );
}

export const TabSections = {
  Loading,
  List,
  Content,
};
