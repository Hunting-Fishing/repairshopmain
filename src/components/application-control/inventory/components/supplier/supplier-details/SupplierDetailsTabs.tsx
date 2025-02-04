import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, MessageSquare, DollarSign, Settings } from "lucide-react";
import { SupplierAnalytics } from "./SupplierAnalytics";
import { SupplierTransactions } from "./SupplierTransactions";
import { SupplierCommunications } from "./SupplierCommunications";
import { SupplierFinancials } from "./SupplierFinancials";
import { SupplierAutomation } from "./SupplierAutomation";
import { SupplierInformation } from "./SupplierInformation";
import type { InventorySupplier } from "../../../types";

interface SupplierDetailsTabsProps {
  supplier: InventorySupplier;
}

export function SupplierDetailsTabs({ supplier }: SupplierDetailsTabsProps) {
  return (
    <Tabs defaultValue="information" className="flex-1 overflow-hidden">
      <TabsList className="w-full justify-start">
        <TabsTrigger value="information">Information</TabsTrigger>
        <TabsTrigger value="analytics" className="flex items-center gap-2">
          <BarChart3 className="h-4 w-4" />
          Analytics
        </TabsTrigger>
        <TabsTrigger value="transactions" className="flex items-center gap-2">
          <DollarSign className="h-4 w-4" />
          Transactions
        </TabsTrigger>
        <TabsTrigger value="communications" className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4" />
          Communications
        </TabsTrigger>
        <TabsTrigger value="automation" className="flex items-center gap-2">
          <Settings className="h-4 w-4" />
          Automation
        </TabsTrigger>
      </TabsList>

      <div className="mt-4 h-full overflow-y-auto pr-4">
        <TabsContent value="information" className="mt-0">
          <SupplierInformation supplier={supplier} />
        </TabsContent>

        <TabsContent value="analytics" className="mt-0">
          <SupplierAnalytics supplierId={supplier.id} />
        </TabsContent>

        <TabsContent value="transactions" className="mt-0">
          <SupplierTransactions supplier={supplier} />
        </TabsContent>

        <TabsContent value="communications" className="mt-0">
          <SupplierCommunications supplier={supplier} />
        </TabsContent>

        <TabsContent value="automation" className="mt-0">
          <SupplierAutomation supplierId={supplier.id} />
        </TabsContent>
      </div>
    </Tabs>
  );
}