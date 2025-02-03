import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useSupplierTransactions(supplierId: string) {
  const { data: transactions, isLoading } = useQuery({
    queryKey: ["supplier-transactions", supplierId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("supplier_transactions")
        .select("*")
        .eq("supplier_id", supplierId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  return {
    transactions,
    isLoading,
  };
}