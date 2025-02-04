import { useOrganizationData } from "@/hooks/staff/useOrganizationData";
import { useSuppliers } from "./hooks/useSuppliers";
import { SupplierDetailsDialog } from "./components/supplier/supplier-details/SupplierDetailsDialog";
import { SupplierErrorBoundary } from "./components/supplier/SupplierErrorBoundary";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, ListFilter } from "lucide-react";
import { SupplierListView } from "./components/supplier/supplier-list/SupplierListView";
import { AnalyticsTabContent } from "./components/supplier/analytics/AnalyticsTabContent";
import { SupplierHeader } from "./components/supplier/supplier-list/SupplierHeader";
import { SupplierLoading } from "./components/supplier/supplier-list/SupplierLoading";
import { SupplierError } from "./components/supplier/supplier-list/SupplierError";
import { useSupplierAnalytics } from "./hooks/useSupplierAnalytics";
import type { InventorySupplier } from "./types";

interface InventorySuppliersProps {
  suppliers?: InventorySupplier[];
}

export function InventorySuppliers({ suppliers = [] }: InventorySuppliersProps) {
  const { userProfile } = useOrganizationData();
  const [selectedSupplier, setSelectedSupplier] = useState<InventorySupplier | null>(null);
  
  const { suppliers: hookSuppliers, isLoading, error } = useSuppliers(userProfile?.organization_id);
  const displaySuppliers = hookSuppliers || suppliers;

  if (isLoading) return <SupplierLoading />;
  if (error) return <SupplierError error={error} />;
  if (!Array.isArray(displaySuppliers)) {
    console.error("InventorySuppliers - suppliers is not an array:", displaySuppliers);
    return <SupplierErrorBoundary error={new Error("Invalid suppliers data")} />;
  }

  const analytics = useSupplierAnalytics(displaySuppliers);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      <SupplierHeader totalSuppliers={displaySuppliers.length} />

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
          <SupplierListView 
            suppliers={displaySuppliers}
            isLoading={isLoading}
            onSupplierClick={setSelectedSupplier}
          />
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <AnalyticsTabContent analytics={analytics} />
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