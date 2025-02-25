
import { NewWorkOrderDialog } from "@/components/work-orders/NewWorkOrderDialog";
import { WorkOrderFilters } from "@/components/work-orders/WorkOrderFilters";
import { WorkOrderHeader } from "@/components/work-orders/WorkOrderHeader";
import { WorkOrderTable } from "@/components/work-orders/WorkOrderTable";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function WorkOrders() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <main className="flex-1 p-6">
          <div className="space-y-6">
            <WorkOrderHeader />
            <WorkOrderFilters />
            <WorkOrderTable />
            <NewWorkOrderDialog />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
