import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SupplierAnalytics } from "./supplier-details/SupplierAnalytics";
import { SupplierTransactions } from "./supplier-details/SupplierTransactions";
import { SupplierDocuments } from "./supplier-details/SupplierDocuments";
import { SupplierCommunications } from "./supplier-details/SupplierCommunications";
import { SupplierFinancials } from "./supplier-details/SupplierFinancials";
import { SupplierAutomation } from "./supplier-details/SupplierAutomation";
import { SupplierReports } from "./supplier-details/SupplierReports";
import type { InventorySupplier } from "../../types";
import { FileText, BarChart3, MessageSquare, Settings, DollarSign, FileArchive, ClipboardList } from "lucide-react";

interface SupplierDetailsDialogProps {
  supplier: InventorySupplier;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SupplierDetailsDialog({ 
  supplier,
  open,
  onOpenChange,
}: SupplierDetailsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {supplier.name}
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="reports" className="flex-1 overflow-hidden">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="reports" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Reports
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="transactions" className="flex items-center gap-2">
              <ClipboardList className="h-4 w-4" />
              Transactions
            </TabsTrigger>
            <TabsTrigger value="documents" className="flex items-center gap-2">
              <FileArchive className="h-4 w-4" />
              Documents
            </TabsTrigger>
            <TabsTrigger value="communications" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Communications
            </TabsTrigger>
            <TabsTrigger value="financials" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Financials
            </TabsTrigger>
            <TabsTrigger value="automation" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Automation
            </TabsTrigger>
          </TabsList>

          <div className="mt-4 h-full overflow-y-auto pr-4">
            <TabsContent value="reports" className="mt-0">
              <SupplierReports supplier={supplier} />
            </TabsContent>

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
      </DialogContent>
    </Dialog>
  );
}