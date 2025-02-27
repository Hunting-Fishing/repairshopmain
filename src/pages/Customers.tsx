
import { useDebouncedCallback } from "use-debounce";
import { Dialog } from "@/components/ui/dialog";
import { useTheme } from "@/contexts/ThemeContext";
import { AppSidebar } from "@/components/layout/AppSidebar";

// Components
import { CustomerHeader } from "@/components/customers/page/CustomerHeader";
import { CustomerToolbar } from "@/components/customers/page/CustomerToolbar";
import { CustomerControls } from "@/components/customers/page/CustomerControls";
import { CustomerTable } from "@/components/customers/customer-management/CustomerTable";
import { CustomerGrid } from "@/components/customers/page/CustomerGrid";
import { CustomerDialogContent } from "@/components/customers/page/CustomerDialogContent";
import { CustomerHeaderContainer } from "@/components/customers/page/CustomerHeaderContainer";
import { CustomerContentContainer } from "@/components/customers/page/CustomerContentContainer";

// Hooks
import { useCustomersList } from "@/components/customers/hooks/useCustomersList";
import { useCustomerDialog } from "@/components/customers/hooks/useCustomerDialog";
import { useViewMode } from "@/components/customers/hooks/useViewMode";

export default function Customers() {
  const { isModernTheme } = useTheme();
  const { viewMode, handleViewModeChange } = useViewMode();
  const { 
    isDialogOpen, 
    openDialog, 
    closeDialog, 
    handleCustomerAdded 
  } = useCustomerDialog();
  
  const { 
    customers, 
    searchQuery, 
    filterValue, 
    isLoading, 
    handleDelete, 
    handleSearchChange, 
    handleFilterChange,
    setDebouncedSearch,
    refetch
  } = useCustomersList();

  // Debounced search for performance
  const debouncedSearch = useDebouncedCallback((value) => {
    setDebouncedSearch(value);
  }, 300);

  // Handle search changes with debounce
  const handleSearch = (query: string) => {
    handleSearchChange(query);
    debouncedSearch(query);
  };

  return (
    <div className="flex min-h-screen w-full">
      <AppSidebar />
      <div className="space-y-8 animate-fade-in p-6 flex-1">
        {/* Header Section */}
        <CustomerHeaderContainer isModernTheme={isModernTheme}>
          <CustomerHeader isModernTheme={isModernTheme} />
          
          <div className="mt-6">
            <CustomerToolbar 
              searchQuery={searchQuery}
              onSearchChange={handleSearch}
              onFilterChange={handleFilterChange}
              filterValue={filterValue}
              isModernTheme={isModernTheme}
            />
            
            <Dialog open={isDialogOpen} onOpenChange={closeDialog}>
              <CustomerControls 
                viewMode={viewMode}
                onViewChange={handleViewModeChange}
                onAddClick={openDialog}
                isModernTheme={isModernTheme}
              />
              
              <CustomerDialogContent 
                isOpen={isDialogOpen}
                onSuccess={() => handleCustomerAdded(refetch)}
                onOpenChange={closeDialog}
                isModernTheme={isModernTheme}
              />
            </Dialog>
          </div>
        </CustomerHeaderContainer>

        {/* Content Section */}
        <CustomerContentContainer isModernTheme={isModernTheme}>
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
        </CustomerContentContainer>
      </div>
    </div>
  );
}
