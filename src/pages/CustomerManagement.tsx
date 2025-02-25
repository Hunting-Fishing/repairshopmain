
import { CustomerHeader } from "@/components/customers/customer-management/CustomerHeader";
import { CustomerTable } from "@/components/customers/customer-management/CustomerTable";
import { CustomerToolbar } from "@/components/customers/customer-management/CustomerToolbar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function CustomerManagement() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <main className="flex-1 p-6">
          <div className="space-y-6">
            <CustomerHeader />
            <CustomerToolbar />
            <CustomerTable />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
