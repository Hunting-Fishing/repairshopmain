
import { useState } from "react";
import { useWorkOrders } from "@/hooks/use-work-orders";
import { WorkOrderTable } from "@/components/work-orders/WorkOrderTable";
import { WorkOrderHeader } from "@/components/work-orders/WorkOrderHeader";
import { WorkOrderFilters } from "@/components/work-orders/WorkOrderFilters";

export default function WorkOrders() {
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const { workOrders, isLoading } = useWorkOrders();

  return (
    <div className="space-y-6">
      <WorkOrderHeader />
      <div className="flex flex-col gap-4">
        <WorkOrderFilters onCustomerSelect={setSelectedCustomerId} />
        <WorkOrderTable workOrders={workOrders} isLoading={isLoading} />
      </div>
    </div>
  );
}
