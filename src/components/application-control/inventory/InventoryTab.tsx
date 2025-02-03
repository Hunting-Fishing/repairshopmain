import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useInventoryData } from "./hooks/useInventoryData";
import { InventoryOverview } from "./InventoryOverview";
import { InventoryCategories } from "./InventoryCategories";
import { InventorySuppliers } from "./InventorySuppliers";
import { InventoryAnalytics } from "./components/analytics/InventoryAnalytics";
import { InventorySettings } from "./components/settings/InventorySettings";
import { InventoryList } from "./components/inventory-list/InventoryList";
import { Skeleton } from "@/components/ui/skeleton";
import { ListTree, Users, Settings, List } from "lucide-react";

export function InventoryTab() {
  const { isLoading, categories, items, suppliers } = useInventoryData();

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
    <div className="space-y-8">
      <InventoryAnalytics />
      
      <div className="rounded-lg border bg-card">
        <Tabs defaultValue="inventory" className="w-full">
          <div className="border-b px-6 pt-4">
            <TabsList className="w-full grid grid-cols-4 lg:w-[600px] mb-4">
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
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Settings
              </TabsTrigger>
            </TabsList>
          </div>
          
          <div className="p-6">
            <TabsContent value="inventory" className="mt-0">
              <InventoryList items={items} />
            </TabsContent>
            
            <TabsContent value="categories" className="mt-0">
              <InventoryCategories categories={categories} />
            </TabsContent>
            
            <TabsContent value="suppliers" className="mt-0">
              <InventorySuppliers suppliers={suppliers} />
            </TabsContent>
            
            <TabsContent value="settings" className="mt-0">
              <InventorySettings />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}