
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { NewWorkOrderDialog } from "@/components/work-orders/NewWorkOrderDialog";
import { WorkOrderFilters } from "@/components/work-orders/WorkOrderFilters";
import { WorkOrderHeader } from "@/components/work-orders/WorkOrderHeader";
import { WorkOrderTable } from "@/components/work-orders/WorkOrderTable";
import { AppSidebar } from "@/components/layout/AppSidebar";

interface RepairJob {
  id: string;
  description: string;
  status: string;
  created_at: string;
  customers: {
    first_name: string;
    last_name: string;
  } | null;
  vehicles: {
    make: string;
    model: string;
    year: string;
  } | null;
}

export default function WorkOrders() {
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);

  const { data: workOrders = [], isLoading } = useQuery({
    queryKey: ["workOrders", selectedCustomerId],
    queryFn: async () => {
      let query = supabase
        .from("customer_repair_jobs")
        .select(`
          id,
          description,
          status,
          created_at,
          customers (
            first_name,
            last_name
          ),
          vehicles (
            make,
            model,
            year
          )
        `);

      if (selectedCustomerId) {
        query = query.eq("customer_id", selectedCustomerId);
      }

      const { data, error } = await query;
      
      if (error) throw error;

      return (data as unknown as RepairJob[]).map(order => ({
        id: order.id,
        customer: order.customers ? `${order.customers.first_name} ${order.customers.last_name}` : 'N/A',
        vehicle: order.vehicles ? `${order.vehicles.year} ${order.vehicles.make} ${order.vehicles.model}` : 'N/A',
        description: order.description,
        status: order.status,
        date: new Date(order.created_at).toISOString().split('T')[0]
      })) || [];
    }
  });

  const handleCustomerSelect = (customerId: string | null) => {
    setSelectedCustomerId(customerId);
  };

  return (
    <div className="flex min-h-screen w-full">
      <AppSidebar />
      <main className="flex-1 p-6">
        <div className="space-y-6">
          <WorkOrderHeader />
          <WorkOrderFilters 
            onCustomerSelect={handleCustomerSelect}
          />
          <WorkOrderTable 
            workOrders={workOrders}
            isLoading={isLoading}
          />
          <NewWorkOrderDialog />
        </div>
      </main>
    </div>
  );
}
