import { useOrganizationData } from "@/hooks/staff/useOrganizationData";
import { useSuppliers } from "./hooks/useSuppliers";
import { SupplierListContainer } from "./components/supplier/supplier-list/SupplierListContainer";
import { AddSupplierDialog } from "./components/supplier/AddSupplierDialog";
import { SupplierDetailsDialog } from "./components/supplier/supplier-details/SupplierDetailsDialog";
import { SupplierErrorBoundary } from "./components/supplier/SupplierErrorBoundary";
import { useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, ListFilter } from "lucide-react";
import { AnalyticsOverview } from "./components/supplier/analytics/AnalyticsOverview";
import type { InventorySupplier } from "./types";

interface InventorySuppliersProps {
  suppliers?: InventorySupplier[];
}

export function InventorySuppliers({ suppliers = [] }: InventorySuppliersProps) {
  const { userProfile } = useOrganizationData();
  const [selectedSupplier, setSelectedSupplier] = useState<InventorySupplier | null>(null);
  
  const { 
    suppliers: hookSuppliers, 
    isLoading, 
    error 
  } = useSuppliers(userProfile?.organization_id);
  
  const displaySuppliers = hookSuppliers || suppliers;

  // Early return for loading state
  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-semibold">Suppliers</h1>
            <p className="text-muted-foreground">Loading supplier data...</p>
          </div>
        </div>
        <LoadingSpinner />
      </div>
    );
  }

  // Early return for error state
  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Alert variant="destructive">
          <AlertDescription>
            Failed to load suppliers: {error.message}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!Array.isArray(displaySuppliers)) {
    console.error("InventorySuppliers - suppliers is not an array:", displaySuppliers);
    return (
      <div className="max-w-7xl mx-auto px-4 py-6">
        <SupplierErrorBoundary error={new Error("Invalid suppliers data")} />
      </div>
    );
  }

  const analytics = {
    total_spend: displaySuppliers.reduce((sum, s) => sum + (s.total_spent || 0), 0),
    orders_count: displaySuppliers.length,
    on_time_delivery_rate: displaySuppliers.reduce((sum, s) => sum + (s.fulfillment_rate || 0), 0) / displaySuppliers.length,
    quality_rating: displaySuppliers.reduce((sum, s) => sum + (s.rating || 0), 0) / displaySuppliers.length,
    orders_fulfilled: displaySuppliers.reduce((sum, s) => sum + (s.fulfillment_rate ? 1 : 0), 0),
    average_delivery_time: 0,
    payment_timeliness_score: 0,
    inventory_value: 0,
    return_rate: 0,
    average_lead_time: 0
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold">Suppliers</h1>
          <p className="text-muted-foreground">
            {displaySuppliers.length === 0 
              ? "No suppliers found. Add your first supplier to get started."
              : `Managing ${displaySuppliers.length} supplier${displaySuppliers.length === 1 ? '' : 's'}`
            }
          </p>
        </div>
        <AddSupplierDialog />
      </div>

      <Tabs defaultValue="list" className="space-y-4">
        <TabsList>
          <TabsTrigger value="list" className="flex items-center gap-2">
            <ListFilter className="h-4 w-4" />
            Supplier List
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Reports & Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4">
          <SupplierListContainer 
            suppliers={displaySuppliers}
            isLoading={isLoading}
            onSupplierClick={setSelectedSupplier}
          />
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <AnalyticsOverview analytics={analytics} />
        </TabsContent>
      </Tabs>

      {selectedSupplier && (
        <SupplierDetailsDialog
          supplier={selectedSupplier}
          open={!!selectedSupplier}
          onOpenChange={() => setSelectedSupplier(null)}
        />
      )}
    </div>
  );
}