import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SupplierAnalytics } from "./SupplierAnalytics";
import { SupplierTransactions } from "./SupplierTransactions";
import { SupplierDocuments } from "./SupplierDocuments";
import { SupplierCommunications } from "./SupplierCommunications";
import { SupplierFinancials } from "./SupplierFinancials";
import { SupplierAutomation } from "./SupplierAutomation";
import type { InventorySupplier } from "../../../types";

interface SupplierDetailsTabsProps {
  supplier: InventorySupplier;
}

export function SupplierDetailsTabs({ supplier }: SupplierDetailsTabsProps) {
  return (
    <Tabs defaultValue="analytics" className="flex-1 overflow-hidden">
      <TabsList className="w-full justify-start">
        <TabsTrigger value="analytics">Analytics</TabsTrigger>
        <TabsTrigger value="transactions">Transactions</TabsTrigger>
        <TabsTrigger value="documents">Documents</TabsTrigger>
        <TabsTrigger value="communications">Communications</TabsTrigger>
        <TabsTrigger value="financials">Financials</TabsTrigger>
        <TabsTrigger value="automation">Automation</TabsTrigger>
      </TabsList>

      <div className="mt-4 h-full overflow-y-auto pr-4">
        <TabsContent value="analytics" className="mt-0">
          <SupplierAnalytics supplierId={supplier.id} />
        </TabsContent>

        <TabsContent value="transactions" className="mt-0">
          <SupplierTransactions supplier={supplier} />
        </TabsContent>

        <TabsContent value="documents" className="mt-0">
          <SupplierDocuments supplier={supplier} />
        </TabsContent>

        <TabsContent value="communications" className="mt-0">
          <SupplierCommunications supplier={supplier} />
        </TabsContent>

        <TabsContent value="financials" className="mt-0">
          <SupplierFinancials supplier={supplier} />
        </TabsContent>

        <TabsContent value="automation" className="mt-0">
          <SupplierAutomation supplierId={supplier.id} />
        </TabsContent>
      </div>
    </Tabs>
  );
}