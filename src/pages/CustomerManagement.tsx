
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CustomerHeader } from "@/components/customers/customer-management/CustomerHeader";
import { CustomerTable } from "@/components/customers/customer-management/CustomerTable";
import { CustomerToolbar } from "@/components/customers/customer-management/CustomerToolbar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function CustomerManagement() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterValue, setFilterValue] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: customers = [], isLoading } = useQuery({
    queryKey: ["customers", searchQuery, filterValue],
    queryFn: async () => {
      let query = supabase
        .from("customers")
        .select("*");

      if (searchQuery) {
        query = query.or(`first_name.ilike.%${searchQuery}%,last_name.ilike.%${searchQuery}%,email.ilike.%${searchQuery}%`);
      }

      if (filterValue !== "all") {
        query = query.eq("status", filterValue);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      return data || [];
    }
  });

  const handleNavigateToControl = () => {
    navigate("/application-control");
  };

  const handleExport = () => {
    // Export functionality would go here
    console.log("Exporting customers...");
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <main className="flex-1 p-6">
          <div className="space-y-6">
            <CustomerHeader onNavigateToControl={handleNavigateToControl} />
            <CustomerToolbar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onFilterChange={setFilterValue}
              onExport={handleExport}
              open={isDialogOpen}
              onOpenChange={setIsDialogOpen}
            />
            <CustomerTable 
              customers={customers}
              isLoading={isLoading}
            />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
