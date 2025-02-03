import { useOrganizationData } from "@/hooks/staff/useOrganizationData";
import { useCategories } from "./useCategories";
import { useItems } from "./useItems";
import { useSuppliers } from "./useSuppliers";

export function useInventoryData() {
  const { userProfile } = useOrganizationData();
  const organizationId = userProfile?.organization_id;

  console.log("useInventoryData - organizationId:", organizationId);
  console.log("useInventoryData - userProfile:", userProfile);

  const { 
    categories, 
    isLoading: categoriesLoading, 
    error: categoriesError,
    addCategory,
    isAddingCategory 
  } = useCategories(organizationId);

  const { 
    items, 
    isLoading: itemsLoading, 
    addItem,
    isAddingItem 
  } = useItems(organizationId);

  const { 
    suppliers, 
    isLoading: suppliersLoading,
    error: suppliersError 
  } = useSuppliers(organizationId);

  console.log("useInventoryData - suppliers:", suppliers);
  console.log("useInventoryData - suppliersError:", suppliersError);
  console.log("useInventoryData - isLoading:", categoriesLoading || itemsLoading || suppliersLoading);

  return {
    categories,
    items,
    suppliers,
    isLoading: categoriesLoading || itemsLoading || suppliersLoading,
    error: categoriesError || suppliersError,
    addCategory,
    isAddingCategory,
    addItem,
    isAddingItem,
  };
}