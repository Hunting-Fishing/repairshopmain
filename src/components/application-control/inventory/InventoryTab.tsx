import { Alert, AlertDescription } from "@/components/ui/alert";
import { useInventoryData } from "./hooks/useInventoryData";
import { InventoryOverview } from "./InventoryOverview";
import { InventoryCategories } from "./InventoryCategories";
import { InventorySuppliers } from "./InventorySuppliers";
import { InventoryAnalytics } from "./components/InventoryAnalytics";
import { Skeleton } from "@/components/ui/skeleton";

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
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-[400px] rounded-lg" />
          ))}
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