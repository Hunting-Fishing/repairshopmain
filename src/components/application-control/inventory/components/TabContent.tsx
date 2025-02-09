
import { TabsContent } from "@/components/ui/tabs";
import { InventoryOverview } from "../InventoryOverview";
import { InventoryList } from "../components/inventory-list/InventoryList";
import { InventoryCategories } from "../InventoryCategories";
import { InventorySuppliers } from "../InventorySuppliers";
import { InventoryHistory } from "../components/history/InventoryHistory";
import { InventorySettings } from "../components/settings/InventorySettings";
import type { InventoryCategory, InventoryItem, InventorySupplier } from "../types";

interface TabContentProps {
  categories: InventoryCategory[];
  items: InventoryItem[];
  suppliers: InventorySupplier[];
}

export function TabContent({ categories, items, suppliers }: TabContentProps) {
  return (
    <>
      <TabsContent value="overview" className="mt-4">
        <InventoryOverview />
      </TabsContent>

      <TabsContent value="inventory" className="mt-4">
        <InventoryList />
      </TabsContent>
      
      <TabsContent value="categories" className="mt-4">
        <InventoryCategories categories={categories} />
      </TabsContent>
      
      <TabsContent value="suppliers" className="mt-4">
        <InventorySuppliers initialSuppliers={suppliers} />
      </TabsContent>

      <TabsContent value="history" className="mt-4">
        <InventoryHistory />
      </TabsContent>
      
      <TabsContent value="settings" className="mt-4">
        <InventorySettings />
      </TabsContent>
    </>
  );
}
