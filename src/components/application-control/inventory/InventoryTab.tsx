
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
import { ListTree, Users, Settings, List, History, BarChart3 } from "lucide-react";
import { TabSections } from "./components/TabSections";

export function InventoryTab() {
  const { isLoading, categories, items, suppliers, error } = useInventoryData();

  console.log("InventoryTab - Loading:", isLoading);
  console.log("InventoryTab - Suppliers:", suppliers);
  console.log("InventoryTab - Error:", error);

  if (isLoading) {
    return <TabSections.Loading />;
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
      <Tabs defaultValue="overview" className="mt-8">
        <TabSections.List />
        <TabSections.Content 
          categories={categories}
          items={items}
          suppliers={suppliers}
        />
      </Tabs>
    </div>
  );
}
