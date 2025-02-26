
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { CustomerTabs } from "@/components/customers/CustomerTabs";
import { AppSidebar } from "@/components/layout/AppSidebar";

export default function CustomerDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: customer, isLoading, error } = useQuery({
    queryKey: ["customer", id],
    queryFn: async () => {
      if (!id) {
        navigate("/customers");
        return null;
      }

      const { data, error } = await supabase
        .from("customers")
        .select("*")
        .eq("id", id)
        .single();
      
      if (error) {
        toast({
          variant: "destructive",
          title: "Error fetching customer",
          description: error.message,
        });
        throw error;
      }

      if (!data) {
        toast({
          variant: "destructive",
          title: "Customer not found",
          description: "The requested customer could not be found.",
        });
        navigate("/customers");
        return null;
      }

      return data;
    },
    retry: false
  });

  if (isLoading) {
    return (
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <main className="flex-1 p-6">
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </main>
      </div>
    );
  }

  if (!customer || !id) {
    return null;
  }

  return (
    <div className="flex min-h-screen w-full">
      <AppSidebar />
      <main className="flex-1 p-6">
        <CustomerTabs customerId={id} defaultTab="details" />
      </main>
    </div>
  );
}
