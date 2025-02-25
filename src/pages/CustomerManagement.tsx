
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { CustomerSettings } from "@/components/customers/CustomerSettings";
import { CustomerHeader } from "@/components/customers/customer-management/CustomerHeader";
import { CustomerToolbar } from "@/components/customers/customer-management/CustomerToolbar";
import { CustomerTable, Customer } from "@/components/customers/customer-management/CustomerTable";

export default function CustomerManagement() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const { data: customers, isLoading } = useQuery({
    queryKey: ["customers", searchQuery, filterStatus],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user.id) return [];

      let query = supabase
        .from("customers")
        .select(`
          *,
          customer_analytics (
            total_spend,
            total_repair_jobs,
            average_rating,
            loyalty_points
          )
        `)
        .order("created_at", { ascending: false });

      if (searchQuery) {
        query = query.or(`first_name.ilike.%${searchQuery}%,last_name.ilike.%${searchQuery}%,email.ilike.%${searchQuery}%`);
      }

      if (filterStatus !== "all") {
        query = query.eq("status", filterStatus);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  const handleExport = () => {
    if (!customers?.length) {
      toast({
        title: "No data to export",
        description: "There are no customers matching your current filters.",
        variant: "destructive",
      });
      return;
    }

    const csvContent = "data:text/csv;charset=utf-8," + 
      "First Name,Last Name,Email,Phone,Address,Status,Total Spend,Loyalty Points\n" +
      customers.map(c => 
        `${c.first_name},${c.last_name},${c.email},${c.phone_number},"${c.street_address}, ${c.city}, ${c.state_province}",${c.status},${c.customer_analytics?.[0]?.total_spend || 0},${c.customer_analytics?.[0]?.loyalty_points || 0}`
      ).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "customers.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Export successful",
      description: "Customer data has been exported to CSV.",
    });
  };

  const handleDeleteCustomer = async (customer: Customer) => {
    try {
      const { error } = await supabase
        .from("customers")
        .delete()
        .eq("id", customer.id);

      if (error) throw error;

      toast({
        title: "Customer deleted",
        description: "The customer has been successfully removed.",
      });
    } catch (error: any) {
      toast({
        title: "Error deleting customer",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <CustomerHeader onNavigateToControl={() => navigate("/customer-management")} />
      <CustomerToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onFilterChange={setFilterStatus}
        onExport={handleExport}
        open={open}
        onOpenChange={setOpen}
      />
      <CustomerTable
        customers={customers ?? []}
        isLoading={isLoading}
        onDelete={handleDeleteCustomer}
      />
      <CustomerSettings />
    </div>
  );
}
