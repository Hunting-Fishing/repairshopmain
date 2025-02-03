import { useOrganizationData } from "@/hooks/staff/useOrganizationData";
import { useCategories } from "./useCategories";
import { useItems } from "./useItems";
import { useSuppliers } from "./useSuppliers";

export function useInventoryData() {
  const { userProfile } = useOrganizationData();
  const organizationId = userProfile?.organization_id;

  // Add console.log to debug organization ID
  console.log("useInventoryData - organizationId:", organizationId);
  console.log("useInventoryData - userProfile:", userProfile);

  const { 
    categories, 
    isLoading: categoriesLoading, 
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
    isLoading: suppliersLoading 
  } = useSuppliers(organizationId);

  // Add console.log to debug fetched data
  console.log("useInventoryData - categories:", categories);
  console.log("useInventoryData - isLoading:", categoriesLoading || itemsLoading || suppliersLoading);

  return {
    categories,
    items,
    suppliers,
    isLoading: categoriesLoading || itemsLoading || suppliersLoading,
    addCategory,
    isAddingCategory,
    addItem,
    isAddingItem,
  };
}