
import { Package } from "lucide-react";
import { useState } from "react";
import { InventoryList } from "@/components/application-control/inventory/InventoryList";
import { InventoryFilters } from "@/components/application-control/inventory/InventoryFilters";
import { InventoryMetrics } from "@/components/application-control/inventory/components/InventoryMetrics";
import { useInventoryData } from "@/components/application-control/inventory/hooks/useInventoryData";
import { AppSidebar } from "@/components/layout/AppSidebar";

export default function Inventory() {
  const { isLoading, error } = useInventoryData();
  
  console.log("Inventory Page - isLoading:", isLoading);
  console.log("Inventory Page - error:", error);

  return (
    <div className="flex min-h-screen w-full">
      <AppSidebar />
      <div className="flex-1 p-4 md:p-6 lg:p-8">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Package className="h-8 w-8" />
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Inventory Management</h1>
                <p className="text-muted-foreground">
                  Manage your inventory and track stock levels
                </p>
              </div>
            </div>
          </div>

          <InventoryMetrics />

          <InventoryList />
        </div>
      </div>
    </div>
  );
}
