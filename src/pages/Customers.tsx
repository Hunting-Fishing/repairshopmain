
import { useState, useCallback, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CustomerForm } from "@/components/customers/CustomerForm";
import { CustomerTable } from "@/components/customers/customer-management/CustomerTable";
import { CustomerHeader } from "@/components/customers/page/CustomerHeader";
import { CustomerSearchBar } from "@/components/customers/page/CustomerSearchBar";
import { CustomerViewToggle } from "@/components/customers/page/CustomerViewToggle";
import { CustomerGrid } from "@/components/customers/page/CustomerGrid";
import { CustomerToolbar } from "@/components/customers/page/CustomerToolbar";
import { useTheme } from "@/contexts/ThemeContext";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { useDebouncedCallback } from "use-debounce";
import { memo } from "react";

// Memoized dialog content to prevent re-renders
const MemoizedCustomerDialog = memo(function MemoizedCustomerDialog({
  isOpen,
  onSuccess,
  onOpenChange,
  isModernTheme,
}: {
  isOpen: boolean;
  onSuccess: () => void;
  onOpenChange: (open: boolean) => void;
  isModernTheme: boolean;
}) {
  if (!isOpen) return null;
  
  return (
    <DialogContent className={`sm:max-w-[800px] max-h-[90vh] ${
      isModernTheme
        ? 'bg-gradient-to-b from-white to-blue-50/10 border-blue-100/20'
        : 'bg-white'
    }`}>
      <ScrollArea className="max-h-[85vh]">
        <DialogHeader className="p-8 rounded-t-lg">
          <DialogTitle className="text-2xl font-bold text-gray-800 flex items-center gap-3">
            Add New Customer
          </DialogTitle>
        </DialogHeader>
        <div className="p-8">
          <CustomerForm 
            onSuccess={onSuccess} 
            mode="create"
            customerId="new"
          />
        </div>
      </ScrollArea>
    </DialogContent>
  );
});

// Memoized toolbar to prevent re-renders
const MemoizedToolbar = memo(function MemoizedToolbar({
  searchQuery,
  onSearchChange,
  onFilterChange,
  filterValue,
  isModernTheme
}: {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onFilterChange: (filter: string) => void;
  filterValue: string;
  isModernTheme: boolean;
}) {
  return (
    <CustomerToolbar 
      searchQuery={searchQuery}
      onSearchChange={onSearchChange}
      onFilterChange={onFilterChange}
      filterValue={filterValue}
      isModernTheme={isModernTheme}
    />
  );
});

// Memoized view toggle + add button
const MemoizedViewControls = memo(function MemoizedViewControls({
  viewMode,
  onViewChange,
  onAddClick,
  isModernTheme
}: {
  viewMode: "list" | "grid";
  onViewChange: (view: "list" | "grid") => void;
  onAddClick: () => void;
  isModernTheme: boolean;
}) {
  return (
    <div className="flex items-center justify-between mb-4">
      <CustomerViewToggle 
        viewMode={viewMode}
        onViewChange={onViewChange}
        isModernTheme={isModernTheme}
      />
      
      <DialogTrigger asChild>
        <Button 
          className={`${
            isModernTheme
              ? 'bg-blue-500 hover:bg-blue-600'
              : 'bg-[#F97316] hover:bg-[#EA580C]'
          } transition-colors shadow-md hover:shadow-lg`}
          size="lg"
          onClick={onAddClick}
        >
          <Plus className="mr-2 h-5 w-5" />
          Add Customer
        </Button>
      </DialogTrigger>
    </div>
  );
});

export default function Customers() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [filterValue, setFilterValue] = useState("all");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const { toast } = useToast();
  const { isModernTheme } = useTheme();

  // Debounced search for performance
  const debouncedSearch = useDebouncedCallback((value) => {
    setDebouncedSearchQuery(value);
  }, 300);

  // Handle search changes with debounce
  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
    debouncedSearch(query);
  }, [debouncedSearch]);

  // Memoize filter function to prevent recreation on each render
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

  // Optimize query with memoized dependencies and proper stale time
  const { data: customers = [], refetch, isLoading } = useQuery({
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

  // Memoize handlers to ensure stable references
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

  const handleCustomerAdded = useCallback(() => {
    setIsDialogOpen(false);
    refetch();
    toast({
      title: "Customer added",
      description: "The customer has been successfully added.",
    });
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

  // Memoize filter change handler
  const handleFilterChange = useCallback((value: string) => {
    setFilterValue(value);
  }, []);

  // Memoize view mode change handler
  const handleViewModeChange = useCallback((mode: "list" | "grid") => {
    setViewMode(mode);
  }, []);

  // Memoize dialog trigger handler
  const handleAddCustomerClick = useCallback(() => {
    setIsDialogOpen(true);
  }, []);

  // Memoize common props to avoid recreating objects on each render
  const toolbarProps = useMemo(() => ({
    searchQuery,
    onSearchChange: handleSearchChange,
    onFilterChange: handleFilterChange,
    filterValue,
    isModernTheme
  }), [searchQuery, handleSearchChange, handleFilterChange, filterValue, isModernTheme]);

  const viewControlsProps = useMemo(() => ({
    viewMode,
    onViewChange: handleViewModeChange,
    onAddClick: handleAddCustomerClick,
    isModernTheme
  }), [viewMode, handleViewModeChange, handleAddCustomerClick, isModernTheme]);

  const customerDialogProps = useMemo(() => ({
    isOpen: isDialogOpen,
    onSuccess: handleCustomerAdded,
    onOpenChange: setIsDialogOpen,
    isModernTheme
  }), [isDialogOpen, handleCustomerAdded, isModernTheme]);

  return (
    <div className="flex min-h-screen w-full">
      <AppSidebar />
      <div className="space-y-8 animate-fade-in p-6 flex-1">
        <div className={`rounded-xl p-8 shadow-lg ${
          isModernTheme 
            ? 'bg-gradient-to-br from-[#F8FAFC]/80 via-[#EFF6FF] to-[#DBEAFE]/50'
            : 'bg-white'
        }`}>
          <CustomerHeader isModernTheme={isModernTheme} />
          
          <div className="mt-6">
            <MemoizedToolbar {...toolbarProps} />
            
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <MemoizedViewControls {...viewControlsProps} />
              <MemoizedCustomerDialog {...customerDialogProps} />
            </Dialog>
          </div>
        </div>

        <div className={`${
          isModernTheme
            ? 'bg-white/80 backdrop-blur-sm'
            : 'bg-white'
        } rounded-xl shadow-lg p-6 animate-fade-in`}>
          {viewMode === "list" ? (
            <CustomerTable 
              customers={customers} 
              isLoading={isLoading}
              onDelete={handleDelete}
            />
          ) : (
            <CustomerGrid 
              customers={customers}
              isModernTheme={isModernTheme}
            />
          )}
        </div>
      </div>
    </div>
  );
}
