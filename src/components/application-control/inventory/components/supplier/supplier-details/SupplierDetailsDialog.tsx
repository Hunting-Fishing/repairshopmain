import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SupplierAnalytics } from "./SupplierAnalytics";
import { SupplierTransactions } from "./SupplierTransactions";
import { SupplierDocuments } from "./SupplierDocuments";
import { SupplierCommunications } from "./SupplierCommunications";
import { SupplierFinancials } from "./SupplierFinancials";
import { SupplierAutomation } from "./SupplierAutomation";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, MapPin } from "lucide-react";
import type { InventorySupplier } from "../../../types";

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
        <DialogHeader className="space-y-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl">
              {supplier.name}
            </DialogTitle>
            <Badge variant={supplier.status === 'active' ? 'default' : 'secondary'}>
              {supplier.status}
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            {supplier.email && (
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{supplier.email}</span>
              </div>
            )}
            {supplier.phone && (
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{supplier.phone}</span>
              </div>
            )}
            {supplier.address && (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{supplier.address}</span>
              </div>
            )}
          </div>
        </DialogHeader>

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
      </DialogContent>
    </Dialog>
  );
}