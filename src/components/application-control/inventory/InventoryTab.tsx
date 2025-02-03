import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useInventoryData } from "./hooks/useInventoryData";
import { InventoryOverview } from "./InventoryOverview";
import { InventoryCategories } from "./InventoryCategories";
import { InventorySuppliers } from "./InventorySuppliers";
import { InventoryAnalytics } from "./components/analytics/InventoryAnalytics";
import { InventorySettings } from "./components/settings/InventorySettings";
import { InventoryList } from "./components/inventory-list/InventoryList";
import { InventoryHistory } from "./components/history/InventoryHistory";
import { Skeleton } from "@/components/ui/skeleton";
import { ListTree, Users, Settings, List, History } from "lucide-react";

export function InventoryTab() {
  const { isLoading, categories, items, suppliers, error } = useInventoryData();

  console.log("InventoryTab - Loading:", isLoading);
  console.log("InventoryTab - Suppliers:", suppliers);
  console.log("InventoryTab - Error:", error);

  if (isLoading) {
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

  if (!categories || !items || !suppliers) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Failed to load inventory data. Please try refreshing the page.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div>
      <InventoryAnalytics />
      <Tabs defaultValue="inventory" className="mt-8">
        <TabsList className="w-full grid grid-cols-5 lg:w-[750px]">
          <TabsTrigger value="inventory" className="flex items-center gap-2">
            <List className="h-4 w-4" />
            Inventory List
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
      </Tabs>
    </div>
  );
}