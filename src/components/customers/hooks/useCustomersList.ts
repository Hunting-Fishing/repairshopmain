
import { useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export interface UseCustomersListOptions {
  initialFilter?: string;
  initialSearchQuery?: string;
}

export function useCustomersList({ 
  initialFilter = "all", 
  initialSearchQuery = "" 
}: UseCustomersListOptions = {}) {
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(initialSearchQuery);
  const [filterValue, setFilterValue] = useState(initialFilter);
  const { toast } = useToast();

  // Function to handle filtering logic
  const getFilterQuery = useCallback((query: any, filter: string) => {
    if (filter !== "all") {
      switch (filter) {
        case "high_value":
          query = query.gt('total_spend', 1000);
          break;
        case "at_risk":
          query = query.gt('churn_risk', 50);
          break;
        default:
          query = query.eq('status', filter);
      }
    }
    return query;
  }, []);

  // Data fetching with react-query
  const { 
    data: customers = [], 
    refetch, 
    isLoading,
    error
  } = useQuery({
    queryKey: ["customers", debouncedSearchQuery, filterValue],
    queryFn: async () => {
      let query = supabase
        .from("customers")
        .select("*");

      if (debouncedSearchQuery) {
        query = query.or(`first_name.ilike.%${debouncedSearchQuery}%,last_name.ilike.%${debouncedSearchQuery}%,email.ilike.%${debouncedSearchQuery}%`);
      }

      query = getFilterQuery(query, filterValue);

      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) {
        toast({
          variant: "destructive",
          title: "Error fetching customers",
          description: error.message,
        });
        throw error;
      }

      return data;
    },
    staleTime: 1000 * 60 * 2, // 2 minutes stale time
  });

  // Customer operations
  const handleDelete = useCallback(async (customer: any) => {
    try {
      const { error } = await supabase
        .from("customers")
        .delete()
        .eq("id", customer.id);

      if (error) throw error;

      toast({
        title: "Customer deleted",
        description: "The customer has been successfully deleted.",
      });
      refetch();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error deleting customer",
        description: error.message,
      });
    }
  }, [refetch, toast]);

  const handleBulkAction = useCallback(async (action: string, selectedIds: string[]) => {
    try {
      switch (action) {
        case "delete":
          const { error } = await supabase
            .from("customers")
            .delete()
            .in("id", selectedIds);

          if (error) throw error;

          toast({
            title: "Customers deleted",
            description: `Successfully deleted ${selectedIds.length} customers.`,
          });
          refetch();
          break;
        // Add other bulk actions here
        default:
          toast({
            title: "Not implemented",
            description: `Bulk action "${action}" is not implemented yet.`,
          });
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error performing bulk action",
        description: error.message,
      });
    }
  }, [refetch, toast]);

  // Handlers
  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
    // Debounce is handled by the component that uses this hook
  }, []);

  const handleFilterChange = useCallback((value: string) => {
    setFilterValue(value);
  }, []);

  const setDebouncedSearch = useCallback((value: string) => {
    setDebouncedSearchQuery(value);
  }, []);

  return {
    customers,
    searchQuery,
    filterValue,
    isLoading,
    error,
    handleDelete,
    handleBulkAction,
    handleSearchChange,
    handleFilterChange,
    setDebouncedSearch,
    refetch
  };
}
