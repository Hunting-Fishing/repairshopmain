import { UserSquare2 } from "lucide-react";
import { CustomerSettings } from "@/components/customers/CustomerSettings";

export default function CustomerManagement() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <UserSquare2 className="h-8 w-8" />
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Customer Management</h1>
          <p className="text-muted-foreground">
            Configure customer-related settings and view analytics
          </p>
        </div>
      </div>
      
      <CustomerSettings />
    </div>
  );
}