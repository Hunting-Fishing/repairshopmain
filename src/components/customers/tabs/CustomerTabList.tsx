
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CUSTOMER_TABS } from "../config/tabConfig";

interface CustomerTabListProps {
  className?: string;
}

export function CustomerTabList({ className }: CustomerTabListProps) {
  return (
    <TabsList className={`grid grid-cols-3 md:grid-cols-6 lg:grid-cols-8 ${className || ""}`}>
      {CUSTOMER_TABS.map((tab) => (
        <TabsTrigger key={tab.id} value={tab.id}>
          {tab.label}
        </TabsTrigger>
      ))}
    </TabsList>
  );
}
