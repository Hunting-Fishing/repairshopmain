
import { Skeleton } from "@/components/ui/skeleton";
import { TabList } from "./TabList";
import { TabContent } from "./TabContent";
import type { InventoryCategory, InventoryItem, InventorySupplier } from "../types";

interface TabContentProps {
  categories: InventoryCategory[];
  items: InventoryItem[];
  suppliers: InventorySupplier[];
}

function Loading() {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-[120px] w-full rounded-lg" />
          ))}
        </div>
        <Skeleton className="h-[300px] w-full rounded-lg" />
      </div>
    </div>
  );
}

export const TabSections = {
  Loading,
  List: TabList,
  Content: TabContent,
};
