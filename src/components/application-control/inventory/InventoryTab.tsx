import { Alert, AlertDescription } from "@/components/ui/alert";
import { useInventoryData } from "./hooks/useInventoryData";
import { InventoryOverview } from "./InventoryOverview";
import { InventoryCategories } from "./InventoryCategories";
import { InventorySuppliers } from "./InventorySuppliers";
import { InventoryAnalytics } from "./components/InventoryAnalytics";

export function InventoryTab() {
  const { isLoading, categories, items, suppliers } = useInventoryData();

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="h-[400px] rounded-lg border bg-card text-card-foreground shadow-sm animate-pulse" />
        <div className="h-[400px] rounded-lg border bg-card text-card-foreground shadow-sm animate-pulse" />
        <div className="h-[400px] rounded-lg border bg-card text-card-foreground shadow-sm animate-pulse" />
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
    <div className="space-y-6">
      <InventoryAnalytics />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <InventoryOverview />
        <InventoryCategories categories={categories} />
        <InventorySuppliers suppliers={suppliers} />
      </div>
    </div>
  );
}