
import { NewWorkOrderDialog } from "@/components/work-orders/NewWorkOrderDialog";

export function WorkOrderHeader() {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Work Orders</h1>
        <p className="text-muted-foreground">
          Manage repair jobs and track progress
        </p>
      </div>
      <NewWorkOrderDialog />
    </div>
  );
}
