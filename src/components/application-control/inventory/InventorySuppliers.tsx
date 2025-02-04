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
    average_lead_time: 0,
    daily_spend: displaySuppliers.reduce((sum, s) => sum + (s.total_spent || 0) / 30, 0),
    weekly_spend: displaySuppliers.reduce((sum, s) => sum + (s.total_spent || 0) / 4, 0),
    monthly_spend: displaySuppliers.reduce((sum, s) => sum + (s.total_spent || 0), 0),
    rebates_amount: 0,
    discounts_amount: 0,
    bill_out_total: 0,
    profit_margin: 0,
    order_value_trend: [],
    delivery_time_trend: [],
    defect_rate: 0,
    negotiated_savings: 0,
    early_payment_discounts: 0,
    volume_discounts: 0,
    seasonal_spend_pattern: {
      Q1: 0,
      Q2: 0,
      Q3: 0,
      Q4: 0
    },
    payment_terms_compliance: 0,
    supplier_diversity_status: null,
    sustainability_score: 0,
    cost_savings_initiatives: [],
    supply_chain_risk_score: 0,
    market_price_variance: 0,
    contract_compliance_rate: 0
  };

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